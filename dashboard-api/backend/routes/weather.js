const NodeCache = require('node-cache')
const weatherCache = new NodeCache({ stdTTL: 300 }) 

app.get('/api/meteo', async (req, res) => {
  const cacheKey = 'meteo-lyon'
  const cached = weatherCache.get(cacheKey)
  if (cached) {
    return res.json(cached)
  }
  const data = await fetchWeatherFromApi() 
  weatherCache.set(cacheKey, data)
  
  res.json(data)
})