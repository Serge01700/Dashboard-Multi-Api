
<template>
  <div class="relative flex items-center justify-center w-full h-screen overflow-hidden transition-colors duration-300" :class="isDarkMode ? 'bg-dark' : 'bg-light'">
    <div ref="ellipseBlur" class="absolute w-[100vh] h-[100vh] rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-500 opacity-0 will-change-auto"></div>
    
    <div 
      class="relative z-20 w-full max-w-md p-5 m-8 backdrop-blur-md transition-all duration-300 rounded-3xl border"
      :class="[
        isDarkMode 
          ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
          : 'bg-light-card border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
       
      ]"
      @mouseenter="isHovered = true" 
      @mouseleave="isHovered = false"
    >
    <p class="date ml-1 mb-1" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">April 29, Tues</p>
  <p class="where text-2xl font-light ml-1" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Lyon</p>
  
      <h2 class="mt-5 text-8xl font-semibold" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
        18°C
      </h2>
      <p class="mb-6" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
      </p>
      <section class="grid grid-cols-3 gap4">
        <section class="bullet-point-weather flex ">
            <BulletPoint :class="isDarkMode ?' bg-dark-card' : 'bg-dark'" class="w-9 h-9 mt-1 mr-1  border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' " :image="'/src/assets/img/icons8-wind-50.png'" size="20px"/>
              <div class="flex-colomn mt-1 ml-1">
                <p class="text-white text-sm"  :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Wind</p>
                <p  class="text-white text-sm"  :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">42 km/h</p>
              </div>
        </section>

        <section class="bullet-point-weather flex ">
            <BulletPoint :class="isDarkMode ? 'bg-dark-card' : 'bg-dark'"  class="w-9 h-9 mt-1 mr-1  border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' " :image="'/src/assets/img/icons8-humidity-64.png'" size="20px"/>
              <div class="flex-colomn mt-1 ml-1">
                <p :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'" class="text-white text-sm">Humidity</p>
                <p :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'"  class="text-white text-sm">82%</p>
              </div>
        </section>

        <section class="bullet-point-weather flex ">
            <BulletPoint :class="isDarkMode ? 'bg-dark-card' : 'bg-dark'" class="w-9 h-9 mt-1 mr-1 border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' " :image="'/src/assets/img/icons8-umbrella-50.png'" size="20px"/>
              <div class="flex-colomn mt-1 ml-1">
                <p :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary '" class="text-white text-sm">Precipitation</p>
                <p :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'" class="text-white text-sm">55%</p>
              </div>
        </section>

      </section>
        
      
      
    </div>
    
    <div class="absolute bottom-4 right-4 z-30">
      <button 
        class="p-2 rounded-full transition-colors duration-300"
        :class="isDarkMode ? 'bg-dark-card text-white' : 'bg-light-card text-gray-800'"
        @click="toggleTheme"
      >
        {{ isDarkMode ? '☀️' : '🌙' }}
      </button>
    </div>
  </div>
</template>

<script>
import BulletPoint from './BulletPoint.vue'
export default {
  components: {
    BulletPoint,
  },
  data() {
    return {
      isHovered: false,
      isDarkMode: true, 
      animationFrameId: null,
      time: 0,
      waveSpeed: 0.001,
      waveAmplitude: 40,
    }
  },
  mounted() {
    this.startWaveAnimation();
    this.updateEllipseColor();
    if (this.$refs.ellipseBlur) {
      this.$refs.ellipseBlur.style.opacity = this.isDarkMode ? "0.3" : "0.7";
    }
  },
  beforeDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  },
  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.updateEllipseColor();
      if (this.$refs.ellipseBlur) {
        this.$refs.ellipseBlur.style.opacity = this.isDarkMode ? "0.4" : "0.7";
      }
    },
    updateEllipseColor() {
      if (this.$refs.ellipseBlur) {
        this.$refs.ellipseBlur.style.backgroundColor = this.isDarkMode 
          ? 'var(--color-dark-ellipse)' 
          : 'var(--color-light-ellipse)';
      }
    },
    startWaveAnimation() {
      this.time = 0;
      this.animateWave();
    },
    animateWave() {
      this.time += 1;
      
      const x = 50 + Math.sin(this.time * this.waveSpeed) * this.waveAmplitude;
      const y = 50 + Math.cos(this.time * this.waveSpeed * 1.2) * this.waveAmplitude;
      
      if (this.$refs.ellipseBlur) {
        this.$refs.ellipseBlur.style.left = `${x}%`;
        this.$refs.ellipseBlur.style.top = `${y}%`;
        this.$refs.ellipseBlur.style.filter = `blur(${this.isDarkMode ? '150px' : '130px'})`;
      }
      
      this.animationFrameId = requestAnimationFrame(this.animateWave);
    }
  }
}
</script>

<style>
:root {
  /* Thème sombre */
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
