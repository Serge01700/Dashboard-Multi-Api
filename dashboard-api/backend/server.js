import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import './config/environment.js' 
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import gmailRoutes from './routes/gmail.js';
import eventRoutes from './routes/events.js';

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
      origin: ['http://localhost:8080', 'http://localhost:5173'],
      credentials: true
    }));

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/gmail', gmailRoutes);
    app.use('/api/events', eventRoutes);

    // Route de test
    app.get('/api/health', (req, res) => {
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