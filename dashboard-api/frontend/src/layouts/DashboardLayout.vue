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
          
        
              <div class="pt-[90px] px-3 pb-3 md:pb-0">
                <RouterView :isDarkMode="isDarkMode" />
              </div>
            </div>
          </div>

          <!-- Sidebar mobile -->
          <div class="md:hidden fixed bottom-0 left-0 right-0 z-20 flex justify-center p-4 backdrop-blur-md bg-black/10">
            <Sidebar class="items-center" :isDarkMode="isDarkMode" />
          </div>

        <!-- Sélecteur de couleur ellipse -->
        <div class="absolute bottom-5 w-8 h-8 left-2  z-30 flex items-center gap-2 px-2 py-1 rounded-md"
             :class="isDarkMode ? 'bg-dark-card text-white' : 'bg-light-card text-gray-800'">
          
          <input type="color"
                 :value="isDarkMode ? darkEllipseColor : lightEllipseColor"
                 @input="onEllipseColorInput($event)"
                 class="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer" />
        </div>

        <!-- Bouton dark mode -->
        <div class="absolute bottom-4 right-4 z-30">
          <button 
            class="p-2 rounded-full transition-colors duration-300"
            :class="isDarkMode ? 'bg-dark-card text-white' : 'bg-light-card text-gray-800'"
            @click="$emit('update:isDarkMode', !isDarkMode); updateEllipseColor(); setInitialEllipseOpacity();"
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
      // Couleurs ellipse par thème
      lightEllipseColor: '#87A4D2',
      darkEllipseColor: '#8a8faa'
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
    this.readDefaultColorsFromCSS();
    this.restoreEllipseColorsFromStorage();
    this.startWaveAnimation();
    this.updateEllipseColor();
    this.setInitialEllipseOpacity();
  },
  beforeDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  },
  methods: {
    setInitialEllipseOpacity() {
      if (this.$refs.ellipseBlur) {
        this.$refs.ellipseBlur.style.opacity = this.isDarkMode ? '0.4' : '0.7';
      }
    },
    readDefaultColorsFromCSS() {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      const cssLight = styles.getPropertyValue('--color-light-ellipse').trim();
      const cssDark = styles.getPropertyValue('--color-dark-ellipse').trim();
      if (cssLight) this.lightEllipseColor = this.normalizeColor(cssLight);
      if (cssDark) this.darkEllipseColor = this.normalizeColor(cssDark);
    },
    restoreEllipseColorsFromStorage() {
      const savedLight = localStorage.getItem('ellipseColorLight');
      const savedDark = localStorage.getItem('ellipseColorDark');
      if (savedLight) this.lightEllipseColor = savedLight;
      if (savedDark) this.darkEllipseColor = savedDark;
    },
    saveEllipseColorsToStorage() {
      localStorage.setItem('ellipseColorLight', this.lightEllipseColor);
      localStorage.setItem('ellipseColorDark', this.darkEllipseColor);
    },
    normalizeColor(color) {
      // Garde hex direct, convertit éventuellement rgb(a) vers hex simple sans alpha
      if (color.startsWith('#')) return color;
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (match) {
        const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
        const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
        const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
      return color;
    },

    onEllipseColorInput(event) {
      const value = event.target.value;
      if (this.isDarkMode) {
        this.darkEllipseColor = value;
      } else {
        this.lightEllipseColor = value;
      }
      this.saveEllipseColorsToStorage();
      this.updateEllipseColor();
    },

    updateEllipseColor() {
      if (this.$refs.ellipseBlur) {
        const color = this.isDarkMode ? this.darkEllipseColor : this.lightEllipseColor;
        this.$refs.ellipseBlur.style.backgroundColor = color || (this.isDarkMode 
          ? 'var(--color-dark-ellipse)'
          : 'var(--color-light-ellipse)');
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