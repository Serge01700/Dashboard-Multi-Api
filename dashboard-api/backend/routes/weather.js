const NodeCache = require('node-cache')
const weatherCache = new NodeCache({ stdTTL: 300 }) // 300s = 5mn

app.get('/api/meteo', async (req, res) => {
  const cacheKey = 'meteo-lyon'
  const cached = weatherCache.get(cacheKey)
  if (cached) {
    return res.json(cached)
  }
  const data = await fetchWeatherFromApi() // ta fonction d'appel API météo
  weatherCache.set(cacheKey, data)
  res.json(data)
})