import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import gmailRoutes from './routes/gmail.js';
import weatherRoutes from './routes/weather.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB
const startServer = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // Middleware
    app.use(express.json());
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }));

    // Configuration de la session
    app.use(session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
      }
    }));

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/gmail', gmailRoutes);
    app.use('/api/weather', weatherRoutes);

    // Route de test
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', message: 'API fonctionnelle' });
    });

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();