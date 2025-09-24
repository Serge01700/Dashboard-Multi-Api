import express from 'express';
import axios from 'axios';
import { finnhubCache } from '../services/FinnhubCache.js';

const router = express.Router();
const FINNHUB_BASE = 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';

// simple proxy for quotes with cache
router.get('/quote/:symbol', async (req, res) => {
  const symbol = (req.params.symbol || '').toUpperCase();
  const key = `finnhub_quote_${symbol}`;
  try {
    const cached = finnhubCache.get(key);
    if (cached) return res.json({ source: 'cache', data: cached });

    const response = await axios.get(`${FINNHUB_BASE}/quote`, { params: { symbol, token: FINNHUB_API_KEY }, timeout: 10000 });
    const data = response.data;
    finnhubCache.set(key, data);
    return res.json({ source: 'external', data });
  } catch (error) {
    console.error('Finnhub quote error:', error);
    return res.status(500).json({ error: 'Erreur Finnhub' });
  }
});

export default router;
