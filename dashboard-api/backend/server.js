import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import './config/environment.js' 
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import gmailRoutes from './routes/gmail.js';
import eventRoutes from './routes/events.js';
import exchangeRoutes from './routes/exchange.js';
import finnhubRoutes from './routes/finnhub.js';
import musicRoutes from './routes/music.js';
import weatherRoutes from './routes/weather.js';

const app = express();
const PORT = process.env.PORT || 3000;
import { generalLimiter } from './config/rateLimiter.js';

// Connexion à MongoDB
const startServer = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // Middleware
    app.use(express.json());
    //Rate limiter général 
    app.use('/api', generalLimiter);
    app.use(cors({
      origin: ['http://localhost:8080', 'http://localhost:5173'],
      credentials: true
    }));

    // Healthcheck endpoint for docker
    app.get('/health', (req, res) => res.json({ status: 'ok' }));

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/gmail', gmailRoutes);
    app.use('/api/events', eventRoutes);
    // CACHES
    app.use('/api/exchange', exchangeRoutes);
    app.use('/api/finnhub', finnhubRoutes);
    app.use('/api/music', musicRoutes);
  app.use('/api/weather', weatherRoutes);

   

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