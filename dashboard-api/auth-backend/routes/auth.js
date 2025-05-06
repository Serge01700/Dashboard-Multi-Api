import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        // Cherche user by mail
        const user = await User.findOne({ email}) ;
        if(!user){
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Verification du mot de passe
        const isValid = await user.comparePassword(password);
        if(!isValid){
            return res.status(401).json({
                message: 'Email ou mot invalides'
            })
        }

        // Genere le token
        const token = jwt.sign(
            { userId: user._id, email: user.email, name: user.name, roles: user.roles },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
         );

         res.json({
            token,
            user:{
                id: user._id,
                email: user.email,
                name: user.name,
                roles: user.roles
            }
         });


        
    } catch (e) {
        console.error('Login error:', e);
        res.status(500).json({ message:` Erreur lors de la cnx` });
    }
})


router.post('/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    
    const { email, password, name } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer un nouvel utilisateur
    const user = new User({ email, password, name });
    await user.save();

    // Générer le token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;