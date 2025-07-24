<template>
  <div class="p-6 min-h-screen">
    <Transition
      appear
      enter-active-class="transition duration-700 ease-out"
      enter-from-class="opacity-0 translate-y-20"
      enter-to-class="opacity-100 translate-y-0"
    >
      <!-- Header with city selector -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 class="text-3xl font-bold" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
          Weather in {{ selectedCity.name }}
        </h1>
        <div class="mt-4 md:mt-0 relative">
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="searchCities"
            placeholder="Search for a city..." 
            class="px-4 py-2 rounded-xl border outline-none w-64"
            :class="[
              isDarkMode 
                ? 'bg-dark-card border-dark-border text-dark-text-primary' 
                : 'bg-light border-light-border text-light-text-primary'
            ]"
          
          />
          <!-- Suggestions list -->
          <div 
            v-if="searchResults.length > 0" 
            class="absolute z-10 w-full mt-2 rounded-xl border overflow-hidden shadow-lg"
            :class="[
              isDarkMode 
                ? 'bg-dark-card border-dark-border' 
                : 'bg-light border-light-border'
            ]"
          >
            <div 
              v-for="city in searchResults" 
              :key="city.id"
              @click="selectCity(city)"
              class="px-4 py-2 cursor-pointer transition-colors duration-200"
              :class="[
                isDarkMode 
                  ? 'hover:bg-dark text-dark-text-primary' 
                  : 'hover:bg-gray-100 text-light-text-primary'
              ]"
            >
              {{ city.name }}, {{ city.country }}
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Transition
        appear
        enter-active-class="transition duration-700 ease-out"
        enter-from-class="opacity-0 translate-x-20"
        enter-to-class="opacity-100 translate-x-0"
      >
        <!-- Current weather card -->
        <div 
          class="relative p-6 rounded-3xl border transition-all duration-300 w-full min-h-[400px] flex flex-col"
          :class="[
            isDarkMode 
              ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
              : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
          ]"
        >
          <div v-if="loading" class="text-center py-8">
            <p :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Loading...</p>
          </div>
          <div v-else-if="error" class="text-center py-8">
            <p class="text-red-500">{{ error }}</p>
          </div>
          <template v-else>
            <!-- Date -->
            <p class="text-lg mb-2" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
              {{ formatDate(new Date()) }}
            </p>

            <!-- Current temperature -->
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-6xl font-bold" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
                {{ Math.round(currentWeather.temperature) }}°C
              </h2>
              <div class="text-right">
                <p class="text-xl" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
                  {{ getWeatherDescription(currentWeather) }}
                </p>
              </div>
            </div>

            <!-- Weather details -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div class="weather-detail w-full min-h-[120px]">
                <BulletPoint 
                  :class="[
                    'w-12 h-12 mb-2',
                    isDarkMode ? 'bg-dark-card' : 'bg-dark',
                    'border-dark-border shadow-dark-shadow'
                  ]"
                  :image="getImageUrl('icons8-wind-50.png')" 
                  size="24px"
                />
                <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">Wind</p>
                <p class="text-lg font-semibold" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
                  {{ Math.round(currentWeather.wind) }} km/h
                </p>
              </div>

              <div class="weather-detail w-full min-h-[120px]">
                <BulletPoint 
                  :class="[
                    'w-12 h-12 mb-2',
                    isDarkMode ? 'bg-dark-card' : 'bg-dark',
                    'border-dark-border shadow-dark-shadow'
                  ]"
                  :image="getImageUrl('icons8-humidity-64.png')" 
                  size="24px"
                />
                <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">Humidity</p>
                <p class="text-lg font-semibold" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
                  {{ Math.round(currentWeather.humidity) }}%
                </p>
              </div>

              <div class="weather-detail w-full min-h-[120px]">
                <BulletPoint 
                  :class="[
                    'w-12 h-12 mb-2',
                    isDarkMode ? 'bg-dark-card' : 'bg-dark',
                    'border-dark-border shadow-dark-shadow'
                  ]"
                  :image="getImageUrl('icons8-umbrella-50.png')" 
                  size="24px"
                />
                <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">Precipitation</p>
                <p class="text-lg font-semibold" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
                  {{ currentWeather.precipitation }} mm
                </p>
              </div>

              <div class="weather-detail w-full min-h-[120px]">
                <BulletPoint 
                  :class="[
                    'w-12 h-12 mb-2',
                    isDarkMode ? 'bg-dark-card' : 'bg-dark',
                    'border-dark-border shadow-dark-shadow'
                  ]"
                  :image="getImageUrl('icons8-météo-pomme-50.png')" 
                  size="24px"
                />
                <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">Feels like</p>
                <p class="text-lg font-semibold" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
                  {{ Math.round(currentWeather.apparentTemperature) }}°C
                </p>
              </div>
            </div>
          </template>
        </div>
      </Transition>

      <Transition
        appear
        enter-active-class="transition duration-700 ease-out"
        enter-from-class="opacity-0 -translate-x-20"
        enter-to-class="opacity-100 translate-x-0"
      >
        <!-- Hourly forecast -->
        <div 
          class="relative p-6 rounded-3xl border transition-all duration-300"
          :class="[
            isDarkMode 
              ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
              : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
          ]"
        >
          <h3 class="text-xl font-semibold mb-4" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
            Hourly Forecast
          </h3>
          <div class="overflow-x-auto">
            <div class="flex space-x-6 pb-4">
              <div v-for="hour in hourlyForecast" :key="hour.time" class="flex flex-col items-center min-w-[80px]">
                <p class="text-sm mb-2" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
                  {{ formatHour(hour.time) }}
                </p>
                <p class="text-lg font-semibold mb-1" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
                  {{ Math.round(hour.temperature) }}°C
                </p>
                <p class="text-xs" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
                  {{ Math.round(hour.precipitation_probability) }}% rain
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition
        appear
        enter-active-class="transition duration-700 ease-out"
        enter-from-class="opacity-0 translate-y-20"
        enter-to-class="opacity-100 translate-y-0"
      >
        <!-- 7-day forecast -->
        <div 
          class="relative p-6 rounded-3xl border transition-all duration-300 lg:col-span-2"
          :class="[
            isDarkMode 
              ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
              : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
          ]"
        >
          <h3 class="text-xl font-semibold mb-4" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
            7-Day Forecast
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              v-for="day in dailyForecast" 
              :key="day.time" 
              class="p-4 rounded-xl border"
              :class="[
                isDarkMode 
                  ? 'bg-dark border-dark-border' 
                  : 'bg-light border-light-border'
              ]"
            >
              <p class="text-sm mb-2" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
                {{ formatDate(new Date(day.time)) }}
              </p>
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-2xl font-semibold" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
                    {{ Math.round(day.temperature_max) }}°C
                  </p>
                  <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
                    Min: {{ Math.round(day.temperature_min) }}°C
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
                    {{ Math.round(day.precipitation_probability_max) }}% rain
                  </p>
                  <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
                    Wind: {{ Math.round(day.wind_speed_max) }} km/h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, Transition } from 'vue'
import BulletPoint from '../components/BulletPoint.vue'
import axios from 'axios'

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
})

const getImageUrl = (name) => {
  return new URL(`../assets/img/${name}`, import.meta.url).href;
}

const currentWeather = ref(null)
const hourlyForecast = ref([])
const dailyForecast = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const searchResults = ref([])
const selectedCity = ref({
  name: 'London',
  latitude: 51.5074,
  longitude: -0.1278,
  country: 'GB'
})

const searchCities = async () => {
  if (searchQuery.value.length < 3) {
    searchResults.value = []
    return
  }

  try {
    const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery.value}&count=5&language=en&format=json`)
    if (response.data.results) {
      searchResults.value = response.data.results.map(city => ({
        id: city.id,
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        country: city.country_code
      }))
    } else {
      searchResults.value = []
    }
  } catch (error) {
    console.error('Error searching for cities:', error)
    searchResults.value = []
  }
}

const selectCity = (city) => {
  selectedCity.value = city
  searchQuery.value = ''
  searchResults.value = []
  fetchWeatherData()
}

const fetchWeatherData = async () => {
  loading.value = true
  error.value = null
  try {
    const { latitude, longitude } = selectedCity.value
    const url = 'https://api.open-meteo.com/v1/forecast'
    const params = {
      latitude,
      longitude,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code',
      hourly: 'temperature_2m,precipitation_probability,weather_code',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
      timezone: 'auto',
      forecast_days: 7
    }

    const { data } = await axios.get(url, { params })
    
    currentWeather.value = {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      apparentTemperature: data.current.apparent_temperature,
      precipitation: data.current.precipitation,
      wind: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code
    }

    hourlyForecast.value = data.hourly.time
      .slice(0, 24)
      .map((time, index) => ({
        time,
        temperature: data.hourly.temperature_2m[index],
        precipitation_probability: data.hourly.precipitation_probability[index],
        weatherCode: data.hourly.weather_code[index]
      }))

    dailyForecast.value = data.daily.time.map((time, index) => ({
      time,
      temperature_max: data.daily.temperature_2m_max[index],
      temperature_min: data.daily.temperature_2m_min[index],
      precipitation_probability_max: data.daily.precipitation_probability_max[index],
      wind_speed_max: data.daily.wind_speed_10m_max[index],
      weatherCode: data.daily.weather_code[index]
    }))

  } catch (e) {
    error.value = 'Error fetching weather data'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date)
}

const formatHour = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getWeatherDescription = (weather) => {
  const codes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Freezing fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight showers',
    81: 'Moderate showers',
    82: 'Violent showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  }
  return codes[weather.weatherCode] || 'Unknown'
}

onMounted(fetchWeatherData)
</script>

<style scoped>
.weather-detail {
  @apply flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300;
}

.weather-detail:hover {
  @apply transform scale-105;
}

/* Scrollbar customization */
.overflow-x-auto::-webkit-scrollbar {
  @apply h-2;
}

.overflow-x-auto::-webkit-scrollbar-track {
  @apply bg-transparent rounded-full;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-400/50 rounded-full transition-all duration-300;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400/70;
}

/* Ajout des transitions pour les éléments de la liste de recherche */
.search-result-enter-active,
.search-result-leave-active {
  transition: all 0.3s ease;
}

.search-result-enter-from,
.search-result-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Transitions pour les prévisions horaires */
.hourly-forecast-enter-active,
.hourly-forecast-leave-active {
  transition: all 0.5s ease;
}

.hourly-forecast-enter-from,
.hourly-forecast-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Transitions pour les prévisions quotidiennes */
.daily-forecast-enter-active,
.daily-forecast-leave-active {
  transition: all 0.5s ease;
}

.daily-forecast-enter-from,
.daily-forecast-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style> 