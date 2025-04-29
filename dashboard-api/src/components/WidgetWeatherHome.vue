
<template>
  <DashboardLayout :isDarkMode="isDarkMode"
  @update:isDarkMode="isDarkMode = $event">
    <div 
      class="relative z-20 w-full max-w-md p-5 m-8 backdrop-blur-md transition-all duration-300 rounded-3xl border"
      :class="[
        isDarkMode 
          ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
          : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
      ]"
    >
      <!-- En-tête -->
      <p class="date ml-1 mb-1" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">April 29, Tues</p>
      <p class="where text-2xl font-light ml-1" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Lyon</p>
      
      <h2 class="mt-5 text-8xl font-semibold" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">18°C</h2>
      
      <section class="grid grid-cols-3 gap-4">
    
        <section class="bullet-point-weather flex">
          <BulletPoint 
            :class="[
              'w-9 h-9 mt-1 mr-1',
              isDarkMode ? 'bg-dark-card' : 'bg-dark',
              'border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover'
            ]"
            :image="'/src/assets/img/icons8-wind-50.png'" 
            size="20px"
          />
          <div class="flex-column mt-1 ml-1">
            <p class="text-sm" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Wind</p>
            <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">42 km/h</p>
          </div>
        </section>

        
        <section class="bullet-point-weather flex">
          <BulletPoint 
            :class="[
              'w-9 h-9 mt-1 mr-1',
              isDarkMode ? 'bg-dark-card' : 'bg-dark',
              'border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover'
            ]"
            :image="'/src/assets/img/icons8-humidity-64.png'" 
            size="20px"
          />
          <div class="flex-column mt-1 ml-1">
            <p class="text-sm" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Humidity</p>
            <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">82%</p>
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
            :image="'/src/assets/img/icons8-umbrella-50.png'" 
            size="20px"
          />
          <div class="flex-column mt-1 ml-1">
            <p class="text-sm" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Precipitation</p>
            <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">55%</p>
          </div>
        </section>
      </section>
    </div>
  </DashboardLayout>
</template>

<script>

import DashboardLayout from '../layout/DashboardLayout.vue'
import BulletPoint from './BulletPoint.vue'
export default {
  name: 'WidgetWeatherHome',
  components: {
    BulletPoint,
    DashboardLayout
  },
  data() {
    return {
      isDarkMode: true
    }
  }
}
</script>

<style>


:root {
  /* Thème sombre */
  --color-sidebar: #1f28338e;
  --color-dark-bg: #0B0C10;
  --color-dark-card: rgba(135, 164, 210, 0.15);
  --color-dark-border: rgba(255, 255, 255, 0.08);
  --color-dark-text-primary: rgba(255, 255, 255, 0.9);
  --color-dark-text-secondary: rgba(255, 255, 255, 0.7);
  --color-dark-accent: rgba(62, 116, 255, 0.7);
  --color-dark-accent-hover: rgba(62, 116, 255, 0.9);
  --color-dark-shadow: rgba(31, 38, 135, 0.15);
  --color-dark-shadow-hover: rgba(62, 116, 255, 0.1);
  --color-dark-ellipse: #3E74FF;

  /* Thème clair */
  --color-light-bg: #F5F7FA;
  --color-light-card: rgba(255, 255, 255, 0.7);
  --color-light-border: rgba(255, 255, 255, 0.8);
  --color-light-text-primary: #2D3748;
  --color-light-text-secondary: #4A5568;
  --color-light-accent: #87A4D2;
  --color-light-accent-hover: #7691BC;
  --color-light-shadow: rgba(135, 164, 210, 0.2);
  --color-light-shadow-hover: rgba(135, 164, 210, 0.3);
  --color-light-ellipse: #87A4D2;
}

.bg-dark-sidebar{
  background-color: var(--color-sidebar);
}

.bg-dark {
  background-color: var(--color-dark-bg);
}

.bg-light {
  background-color: var(--color-light-bg);
}

.bg-dark-card {
  background-color: var(--color-dark-card);
}

.bg-light-card {
  background-color: var(--color-light-card);
}

.border-dark-border {
  border-color: var(--color-dark-border);
}

.border-light-border {
  border-color: var(--color-light-border);
}

.text-dark-text-primary {
  color: var(--color-dark-text-primary);
}

.text-light-text-primary {
  color: var(--color-light-text-primary);
}

.text-dark-text-secondary {
  color: var(--color-dark-text-secondary);
}

.text-light-text-secondary {
  color: var(--color-light-text-secondary);
}

.bg-dark-accent {
  background-color: var(--color-dark-accent);
}

.bg-light-accent {
  background-color: var(--color-light-accent);
}

.hover\:bg-dark-accent-hover:hover {
  background-color: var(--color-dark-accent-hover);
}

.hover\:bg-light-accent-hover:hover {
  background-color: var(--color-light-accent-hover);
}

.shadow-dark-shadow {
  box-shadow: 0 8px 32px 0 var(--color-dark-shadow);
}

.shadow-light-shadow {
  box-shadow: 0 8px 32px 0 var(--color-light-shadow);
}

.hover\:shadow-dark-shadow-hover:hover {
  box-shadow: 0 12px 40px 0 var(--color-dark-shadow-hover);
}

.hover\:shadow-light-shadow-hover:hover {
  box-shadow: 0 12px 40px 0 var(--color-light-shadow-hover);
}
</style>
