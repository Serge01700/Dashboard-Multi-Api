<template>
  <div class="relative flex items-center justify-center w-full h-screen overflow-hidden" 
       :class="isDarkMode ? 'bg-dark' : 'bg-light'">

    <div ref="ellipseBlur" 
         class="absolute w-[100vh] h-[100vh] rounded-full transform -translate-x-1/2 -translate-y-1/2 z-0 transition-opacity duration-500 opacity-0 will-change-auto">
    </div>

    <div class="flex h-full w-full">
      <!-- Conteneur de la sidebar avec sa barre verticale -->
      <div class="relative flex-shrink-0" style="width: 120px;">
        <!-- Zone de la sidebar -->
        <div class="flex items-center justify-center h-full" style="width: 112px;">
          <Sidebar class="items-center" :isDarkMode="isDarkMode" />
        </div>
        <!-- Barre verticale -->
        <div class="absolute top-0 right-0 h-full w-[1px] bg-gray-700"></div>
      </div>

      <div class="flex-1 relative">
        <!-- Barre horizontale -->
        <div class="absolute top-[70px] left-0 w-full h-[1px] bg-gray-700"></div>
        
      
        <div class="h-full overflow-auto pt-[90px] px-6">
          <RouterView :isDarkMode="isDarkMode" />
        </div>
      </div>

      <!-- Bouton dark mode -->
      <div class="absolute bottom-4 right-4 z-30">
        <button 
          class="p-2 rounded-full transition-colors duration-300"
          :class="isDarkMode ? 'bg-dark-card text-white' : 'bg-light-card text-gray-800'"
          @click="$emit('update:isDarkMode', !isDarkMode)"
        >
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import Sidebar from '../components/Sidebar.vue'

export default {
  components: { Sidebar },
    name:'DahsboardLayout',
  data() {
    return {
      animationFrameId: null,
      time: 0,
      waveSpeed: 0.001,
      waveAmplitude: 40,
    }
  },
  props: {
    isDarkMode: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:isDarkMode'],
  mounted() {
    this.startWaveAnimation();
    this.updateEllipseColor();
    if (this.$refs.ellipseBlur) {
      this.$refs.ellipseBlur.style.opacity = this.isDarkMode ? "0.4" : "0.7";
    }
  },
  beforeDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  },
  methods: {
    toggleTheme() {
      this.$emit('update:isDarkMode', !this.isDarkMode);
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

</style>