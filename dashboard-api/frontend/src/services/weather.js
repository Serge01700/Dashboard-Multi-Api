import axios from 'axios';

export async function fetchWeatherForLyon() {
  const latitude = 45.75;
  const longitude = 4.85;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,precipitation&timezone=Europe%2FParis`;
  const { data } = await axios.get(url);
  if (data && data.current) {
    return {
      temperature: data.current.temperature_2m,
      wind: data.current.wind_speed_10m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
    };
  }
  throw new Error('Données météo indisponibles');
} 