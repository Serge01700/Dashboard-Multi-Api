const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_par_defaut_a_changer';

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5174', // URL de votre frontend Vue.js
  credentials: true
}));

// Base de données simulée (remplacer par une vraie base de données en production)
const users = [];

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Authentication Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      register: '/api/auth/register',
      login: '/api/auth/login',
      profile: '/api/users/profile'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Inscription
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      roles: ['user']
    };

    // Ajouter l'utilisateur à la "base de données"
    users.push(newUser);

    // Créer un token JWT
    const token = jwt.sign(
      { 
        sub: newUser.id, 
        email: newUser.email,
        name: newUser.name,
        roles: newUser.roles 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Réponse
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        roles: newUser.roles
      }
    });

    console.log(`Utilisateur créé: ${email}`);
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

// Connexion
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Chercher l'utilisateur
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = jwt.sign(
      { 
        sub: user.id, 
        email: user.email,
        name: user.name,
        roles: user.roles 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Réponse
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles
      }
    });

    console.log(`Utilisateur connecté: ${email}`);
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Middleware d'authentification pour les routes protégées
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Route protégée exemple
app.get('/api/users/profile', authenticateToken, (req, res) => {
  // Trouver l'utilisateur dans la "base de données"
  const user = users.find(user => user.id === req.user.sub);
  
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`API accessible à http://localhost:${PORT}/api`);
});