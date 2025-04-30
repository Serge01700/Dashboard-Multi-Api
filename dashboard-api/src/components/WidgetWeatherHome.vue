
<template>

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

</template>

<script>


import BulletPoint from './BulletPoint.vue'
export default {
  name: 'WidgetWeatherHome',
  components: {
    BulletPoint,
  },
  props: {
    isDarkMode: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style>

</style>
