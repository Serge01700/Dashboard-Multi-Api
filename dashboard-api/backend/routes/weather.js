import express from 'express';
import NodeCache from 'node-cache';

const router = express.Router();
const weatherCache = new NodeCache({ stdTTL: 300 });

router.get('/', async (req, res) => {
  const cacheKey = 'meteo-lyon';
  const cached = weatherCache.get(cacheKey);
  
  if (cached) {
    return res.json(cached);
  }
  
  try {
    const data = await fetchWeatherFromApi();
    weatherCache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données météo:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données météo' });
  }
});

async function fetchWeatherFromApi() {
  // TODO: Implémenter la logique de récupération des données météo
  return {
    temperature: 20,
    condition: 'ensoleillé',
    humidity: 65,
    windSpeed: 10
  };
}

export default router;