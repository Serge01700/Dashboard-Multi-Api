<template>

    <div 
    class="relative z-20 w-full max-w-lg p-5 m-4 backdrop-blur-md transition-all duration-300 rounded-3xl border h-[250px] md:h-[210px]" 
    :class="[
      isDarkMode 
        ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
        : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
    ]"
  >
      <!-- En-tête -->
      <p class="date ml-1 mb-1 text-base md:text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">  {{ month }} {{  dayNumber }}, {{ dayLetter }}</p>
      <span class="text-base md:text-sm"></span>
      <p class="where text-2xl md:text-lg font-light ml-1" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Lyon</p>
      
      <div v-if="loading" class="mt-5 text-center text-lg">Chargement météo...</div>
      <div v-else-if="error" class="mt-5 text-center text-red-500">{{ error }}</div>
      <template v-else>
        <h2 class="mt-5 text-6xl md:text-4xl font-semibold" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">{{ temperature !== null ? Math.round(temperature) + '°C' : '--' }}</h2>
        
        <section class="grid grid-cols-3 gap-2 mt-6">
    
          <section class="bullet-point-weather flex">
            <BulletPoint 
              :class="[
                'w-9 h-9 mt-1 mr-1',
                isDarkMode ? 'bg-dark-card' : 'bg-dark',
                'border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover'
              ]"
              :image="getImageUrl('icons8-wind-50.png')"
              size="20px"
            />
            <div class="flex-column mt-1 ml-1">
              <p class="text-sm" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Wind</p>
              <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">{{ wind !== null ? Math.round(wind) + ' km/h' : '--' }}</p>
            </div>
          </section>

          
          <section class="bullet-point-weather flex ">
            <BulletPoint 
              :class="[
                'w-9 h-9 mt-1 mr-1',
                isDarkMode ? 'bg-dark-card' : 'bg-dark',
                'border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover'
              ]"
              :image="getImageUrl('icons8-humidity-64.png')"
              size="20px"
            />
            <div class="flex-column mt-1 ml-1">
              <p class="text-sm" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Humiditity</p>
              <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">{{ humidity !== null ? Math.round(humidity) + '%' : '--' }}</p>
            </div>
          </section>

          <!-- Precipitation -->
          <section class="bullet-point-weather flex">
            <BulletPoint 
              :class="[
                'w-9 h-9 mt-1 mr-1',
                isDarkMode ? 'bg-dark-card' : 'bg-dark',
                'border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover'
              ]"
              :image="getImageUrl('icons8-umbrella-50.png')"
              size="20px"
            />
            <div class="flex-column mt-1 ml-1">
              <p class="text-sm" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Précipitation</p>
              <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">{{ precipitation !== null ? precipitation + ' mm' : '--' }}</p>
            </div>
          </section>
        </section>
      </template>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BulletPoint from './BulletPoint.vue'
import { fetchWeatherForLyon } from '@/services/weather'

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});

const getImageUrl = (name) => {
  return new URL(`../assets/img/${name}`, import.meta.url).href;
}

// États réactifs
const temperature = ref(null)
const wind = ref(null)
const humidity = ref(null)
const precipitation = ref(null)
const loading = ref(true)
const error = ref(null)

// Récupération météo via le service
const fetchWeather = async () => {
  loading.value = true
  error.value = null
  try {
    const meteo = await fetchWeatherForLyon()
    temperature.value = meteo.temperature
    wind.value = meteo.wind
    humidity.value = meteo.humidity
    precipitation.value = meteo.precipitation
  } catch (e) {
    error.value = e.message || 'Erreur lors de la récupération météo'
  } finally {
    loading.value = false
  }
}

onMounted(fetchWeather)

// Date
const dayLetter = computed(() => new Date().toLocaleDateString('en-EN', { weekday: 'short' }))
const dayNumber = computed(() => new Date().getDate())
const month = computed(() => new Date().toLocaleDateString('en-EN', { month: 'long' }))
</script>

<style>
</style>