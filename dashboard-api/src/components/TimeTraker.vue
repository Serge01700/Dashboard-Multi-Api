<template>
  <div
    class="time-tracker border rounded-3xl p-6 w-[360px]"
    :class=" [
      isDarkMode 
        ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
        : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
    ]"
   >
    
    <div class="header">
      <div class="clock-icon">
        <svg viewBox="0 0 24 24" fill="none" :stroke="isDarkMode ? '#ffffff' : '#2D3748'" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      </div>
      <h1 class="title"
        :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">Time tracker</h1>
    </div>
    
    <div class="content">
      <div class="time-display"
         :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
        {{ formattedTime }}
      </div>
      
      <div class="controls">
        <button 
          class="control-btn" 
          :class="{ 'btn-pause': isRunning }"
          @click="toggleTimer"
        >
          <div v-if="isRunning" class="pause-icon"></div>
          <div v-else class="play-icon"></div>
        </button>
        <button 
          class="control-btn btn-stop" 
          @click="stopTimer"
        >
          <div class="stop-icon"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});

const totalSeconds = ref(0);
const isRunning = ref(false);
let intervalId = null

const formattedTime = computed(() => {
  const hours = Math.floor(totalSeconds.value / 3600)
  const minutes = Math.floor((totalSeconds.value % 3600) / 60)
  const seconds = totalSeconds.value % 60

  const pad = (n) => n.toString().padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
})

const startTimer = () => {
  if (!intervalId) {
    intervalId = setInterval(() => {
      totalSeconds.value++
    }, 1000)
  }
  isRunning.value = true
}

const pauseTimer = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  isRunning.value = false
}

const stopTimer = () => {
  pauseTimer()
  totalSeconds.value = 0
}

const toggleTimer = () => {
  isRunning.value ? pauseTimer() : startTimer()
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  /* background: #1a2332; */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.time-tracker {
  
  border-radius: 28px;
  padding: 15px 28px;
  width: 399px;
  /* box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); */
  /* border: 1px solid #3a4551; */
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.clock-icon {
  width: 24px;
  height: 24px;
  position: relative;
  flex-shrink: 0;
}

.clock-icon svg {
  width: 24px;
  height: 24px;
}

.title {
  /* color: #ffffff; */
  font-size: 16px;
  font-weight: 400;
  letter-spacing: -0.02em;
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.time-display {
  font-size: 46px;
  font-weight: 300;
  /* color: #ffffff; */
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  line-height: 1;
}

.controls {
  display: flex;
  gap: 12px;
  margin-left: 20px;
}

.control-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #3a4551;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: 1px solid #4a5561;
}

.control-btn:hover {
  background: #4a5561;
  transform: translateY(-1px);
}

.control-btn:active {
  transform: translateY(0);
  background: #2a3441;
}

.pause-icon {
  width: 12px;
  height: 16px;
  background: linear-gradient(to right, 
      #ffffff 0%, #ffffff 28%, 
      transparent 28%, transparent 72%, 
      #ffffff 72%, #ffffff 100%);
}

.play-icon {
  width: 0;
  height: 0;
  border-left: 14px solid #ffffff;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  margin-left: 3px;
}

.stop-icon {
  width: 14px;
  height: 14px;
  background: #ffffff;
  border-radius: 3px;
}

.btn-pause {
  background: #4a5561;
}

.btn-stop {
  background: #3a4551;
}
</style>
