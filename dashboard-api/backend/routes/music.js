import express from 'express';
import axios from 'axios';
import { musicCache } from '../services/MusicCache.js';

const router = express.Router();
const ITUNES_BASE = 'https://itunes.apple.com';

router.get('/search', async (req, res) => {
  const term = req.query.term || 'pop';
  const cacheKey = `music_search_${term}`;
  try {
    const cached = musicCache.get(cacheKey);
    if (cached) return res.json({ source: 'cache', results: cached });

    const resp = await axios.get(`${ITUNES_BASE}/search`, { params: { term, media: 'music', entity: 'song', limit: 12, country: 'FR' }, timeout: 10000 });
    const results = resp.data?.results || [];
    musicCache.set(cacheKey, results);
    return res.json({ source: 'external', results });
  } catch (error) {
    console.error('Music search error:', error);
    return res.status(500).json({ error: 'Erreur iTunes' });
  }
});

export default router;
