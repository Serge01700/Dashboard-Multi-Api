import express from 'express';
import axios from 'axios';
import { exchangeCache } from '../services/ExchangeCache.js';

const router = express.Router();
const EXTERNAL_BASE = 'https://api.exchangerate-api.com/v4';

router.get('/latest/:base', async (req, res) => {
  const base = (req.params.base || 'USD').toUpperCase();
  const cacheKey = `exchange_${base}`;

  try {
    const cached = exchangeCache.get(cacheKey);
    if (cached) return res.json({ source: 'cache', rates: cached });

    const response = await axios.get(`${EXTERNAL_BASE}/latest/${base}`, { timeout: 10000 });
    const rates = response.data?.rates || null;
    if (!rates) return res.status(502).json({ error: 'Invalid external response' });

    exchangeCache.set(cacheKey, rates);
    return res.json({ source: 'external', rates });
  } catch (error) {
    console.error('Exchange endpoint error:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des taux de change', details: error.message });
  }
});

export default router;
