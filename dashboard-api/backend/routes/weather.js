import express from 'express';
import { weatherCache } from '../services/WeatherCache.js';
import axios from 'axios';

const router = express.Router();

// Coordonnées des villes principales (à étendre selon vos besoins)
const CITY_COORDINATES = {
  'lyon': { lat: 45.75, lon: 4.85 },
  'paris': { lat: 48.8566, lon: 2.3522 },
  'marseille': { lat: 43.2965, lon: 5.3698 },
  'bordeaux': { lat: 44.8378, lon: -0.5792 },
  'lille': { lat: 50.6292, lon: 3.0573 }
};

// Route pour obtenir la météo d'une ville
router.get('/:city', async (req, res) => {
  const { city } = req.params;
  const cityLower = city.toLowerCase();
  const cacheKey = `weather_${cityLower}`;
  
  try {
    // Vérifier si la ville est supportée
    if (!CITY_COORDINATES[cityLower]) {
      return res.status(400).json({ 
        error: 'Ville non supportée',
        supportedCities: Object.keys(CITY_COORDINATES)
      });
    }

    // Vérifier le cache
    const cachedData = weatherCache.get(cacheKey);
    if (cachedData) {
      console.log(`Données météo trouvées dans le cache pour ${city}`);
      return res.json(cachedData);
    }

    // Récupérer les données fraîches
    const weatherData = await fetchWeatherFromApi(cityLower);
    
    // Mettre en cache
    weatherCache.set(cacheKey, weatherData);
    
    res.json(weatherData);
  } catch (error) {
    console.error(`Erreur lors de la récupération des données météo pour ${city}:`, error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des données météo',
      details: error.message 
    });
  }
});

// Route pour lister les villes disponibles
router.get('/cities/available', (req, res) => {
  res.json({
    cities: Object.keys(CITY_COORDINATES),
    total: Object.keys(CITY_COORDINATES).length
  });
});

async function fetchWeatherFromApi(city) {
  const { lat, lon } = CITY_COORDINATES[city];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,precipitation&timezone=Europe%2FParis`;
  
  try {
    const { data } = await axios.get(url);
    
    if (data && data.current) {
      return {
        city: city,
        temperature: data.current.temperature_2m,
        windSpeed: data.current.wind_speed_10m,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        timestamp: new Date().toISOString()
      };
    }
    
    throw new Error('Format de données météo invalide');
  } catch (error) {
    throw new Error(`Erreur API météo: ${error.message}`);
  }
}

export default router;