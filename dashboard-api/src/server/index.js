// server/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Configuration du serveur
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Clé secrète pour JWT (à mettre dans les variables d'environnement en production)
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue_et_complexe';

// Base de données simulée (à remplacer par une vraie base de données)
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'admin@example.com',
    // Mot de passe hashé (correspond à "password123")
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTmJC.qFBJ8eTtX3Cq1iGTNaTImjiO',
    roles: ['user', 'admin']
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'user@example.com',
    // Mot de passe hashé (correspond à "password123")
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTmJC.qFBJ8eTtX3Cq1iGTNaTImjiO',
    roles: ['user']
  }
];

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentification requise' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide ou expiré' });
    }
    
    req.user = user;
    next();
  });
};

// Route de connexion
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérification des champs requis
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    
    // Recherche de l'utilisateur
    const user = users.find(u => u.email === email);
    
    // Si l'utilisateur n'existe pas
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    // Génération du token JWT
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
    
    // Retourner le token et les informations utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Route de déconnexion (côté client, la déconnexion se fait en supprimant le token)
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Déconnexion réussie' });
});

// Route protégée pour récupérer le profil utilisateur
app.get('/api/users/profile', authenticateToken, (req, res) => {
  // L'ID utilisateur est stocké dans req.user.sub
  const userId = req.user.sub;
  
  // Recherche de l'utilisateur dans notre "base de données"
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
  
  // Retourner les informations utilisateur (sans le mot de passe)
  const { password, ...userWithoutPassword } = user;
  
  res.json(userWithoutPassword);
});

// Route pour mettre à jour le profil utilisateur
app.put('/api/users/profile', authenticateToken, (req, res) => {
  const userId = req.user.sub;
  const { name, email } = req.body;
  
  // Recherche de l'utilisateur
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
  
  // Mettre à jour les informations
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
  };
  
  // Retourner les informations mises à jour (sans le mot de passe)
  const { password, ...userWithoutPassword } = users[userIndex];
  
  res.json(userWithoutPassword);
});

// Route pour changer le mot de passe
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { currentPassword, newPassword } = req.body;
    
    // Vérification des champs requis
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    // Recherche de l'utilisateur
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérification du mot de passe actuel
    const isPasswordValid = await bcrypt.compare(currentPassword, users[userIndex].password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    }
    
    // Hashage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Mise à jour du mot de passe
    users[userIndex].password = hashedPassword;
    
    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});