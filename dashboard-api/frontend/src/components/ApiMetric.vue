<template>
  <div class="api-metric overflow-y-auto relative z-20 w-full max-w-lg p-5 m-4 backdrop-blur-md transition-all duration-300 rounded-3xl border h-[250px] md:h-[210px]"
    :class="[
      isDarkMode 
        ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
        : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
    ]">
    <p class="mb-4 text-2xl md:text-lg font-light" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">API Status</p>

    <!-- API METEO  -->
    <div class="bg-dark-2 rounded-lg p-3 mb-4">
      <div class="flex items-center gap-2"> 
        <p :class="['rounded-full w-4 h-4', weatherStatus==='ok' ? 'bg-green-500' : 'bg-red-500']"></p>
        <div class="flex flex-col">
          <p class="text-sm" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Weather API</p>
          <p class="text-[9px] mt-1 tracking-wide font-bold" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
            {{ weatherStatus === 'ok' ? 'Operational' : 'Down' }}
          </p>
        </div>
      </div>
    </div>

    <!-- API GMAIL  -->

    <div class="bg-dark-2 rounded-lg p-3 mb-4">
      <div class="flex items-center gap-2"> 
        <p :class="['rounded-full w-4 h-4', gmailStatus==='ok' ? 'bg-green-500' : 'bg-red-500']"></p>
        <div class="flex flex-col">
          <p class="text-sm" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Email API</p>
          <p class="text-[9px] mt-1 tracking-wide font-bold" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
            {{ gmailStatus === 'ok' ? 'Operational' : 'Down' }}
          </p>
        </div>
      </div>
    </div>

    <!-- API FINNHUB  -->


    <div class="bg-dark-2 rounded-lg p-3 mb-4">
      <div class="flex items-center gap-2"> 
        <p :class="['rounded-full w-4 h-4', finnhubStatus==='ok' ? 'bg-green-500' : 'bg-red-500']"></p>
        <div class="flex flex-col">
          <p class="text-sm" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Finance API</p>
          <p class="text-[9px] mt-1 tracking-wide font-bold" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
            {{ finnhubStatus === 'ok' ? 'Operational' : 'Down' }}
          </p>
        </div>
      </div>
    </div>

    <!-- API MUSIC  -->

    <div class="bg-dark-2 rounded-lg p-3 mb-4">
      <div class="flex items-center gap-2 "> 
        <p :class="['rounded-full w-4 h-4', musicStatus==='ok' ? 'bg-green-500' : 'bg-red-500']"></p>
        <div class="flex flex-col">
          <p class="text-sm" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Music API</p>
          <p class="text-[9px] mt-1 tracking-wide font-bold" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
            {{ musicStatus === 'ok' ? 'Operational' : 'Down' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchWeatherForLyon } from '@/services/weather.js';
import { fetchAllMails } from '@/services/gmail.js';
import { finnhubService } from '@/services/finnhub.js';
import { musicService } from '@/services/music.js';

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});

const weatherStatus = ref('pending');
const gmailStatus = ref('pending');
const finnhubStatus = ref('pending');
const musicStatus = ref('pending');

onMounted(async () => {
  // Weather API
  try {
    await fetchWeatherForLyon();
    weatherStatus.value = 'ok';
  } catch (e) {
    weatherStatus.value = 'fail';
  }

  // Gmail API
  try {
    await fetchAllMails();
    gmailStatus.value = 'ok';
  } catch (e) {
    gmailStatus.value = 'fail';
  }

  // Finnhub API
  try {
    await finnhubService.getQuote('AAPL');
    finnhubStatus.value = 'ok';
  } catch (e) {
    finnhubStatus.value = 'fail';
  }

  // Music API
  try {
    await musicService.fetchMusicByGenre('pop');
    musicStatus.value = 'ok';
  } catch (e) {
    musicStatus.value = 'fail';
  }
});
</script>

<style>
.overflow-y-auto::-webkit-scrollbar {
  width: 3px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>