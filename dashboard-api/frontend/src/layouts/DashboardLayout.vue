<template>
  <div class="relative w-full h-screen overflow-hidden" 
       :class="isDarkMode ? 'bg-dark' : 'bg-light'">

      <div ref="ellipseBlur" 
          class="absolute w-[100vh] h-[100vh] rounded-full transform -translate-x-1/2 -translate-y-1/2 z-0 transition-opacity duration-500 opacity-0 will-change-auto">
      </div>

      <!-- Contenu principal avec scroll -->
      <div class="flex flex-col md:flex-row h-full w-full">
        <!-- Conteneur de la sidebar avec sa barre verticale -->
        <div class="relative flex-shrink-0 md:w-[120px] w-full flex justify-center md:justify-start order-2 md:order-1 hidden md:flex">
          <!-- Zone de la sidebar -->
          <div class="flex items-center justify-center h-auto md:h-full w-auto md:w-[112px] p-4 md:p-0">
            <Sidebar class="items-center" :isDarkMode="isDarkMode" />
          </div>
          <!-- Barre verticale - cachée en mobile -->
          <div class="absolute top-0 right-0 h-full w-[1px] hidden md:block"
               :class="isDarkMode ? 'bg-white opacity-30' : 'bg-gray-500'"></div>
        </div>

        <div class="flex-1 relative order-1 md:order-2 overflow-y-auto">
          <!-- Barre horizontale - cachée en mobile -->
          <div class="absolute top-[70px] left-0 w-full h-[1px] hidden md:block"
               :class="isDarkMode ? 'bg-white opacity-30' : 'bg-gray-500'"></div>
          
        
              <div class="pt-[90px] px-6 pb-32 md:pb-0">
                <RouterView :isDarkMode="isDarkMode" />
              </div>
            </div>
          </div>

          <!-- Sidebar mobile -->
          <div class="md:hidden fixed bottom-0 left-0 right-0 z-20 flex justify-center p-4 backdrop-blur-md bg-black/10">
            <Sidebar class="items-center" :isDarkMode="isDarkMode" />
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
      const y = 50 + Math.cos(this.time * this.waveSpeed * 2.2) * this.waveAmplitude;
      
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