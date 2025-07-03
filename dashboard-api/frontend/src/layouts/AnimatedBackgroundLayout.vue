<template>
  <div class="custom-bg">
    <div class="dashboard">
      <div class="ellipse ellipse-blue"></div>
      <div class="ellipse ellipse-purple"></div>
      <div class="animated-background">
        <div
          v-for="(bar, index) in bars"
          :key="index"
          class="light-bar"
          :style="barStyle(bar)"
        />
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const bars = ref([])

const generateBars = () => {
  const numberOfBars = Math.floor(Math.random() * 6) + 15
  for (let i = 0; i < numberOfBars; i++) {
    const isBlue = Math.random() > 0.5
    bars.value.push({
      position: Math.random() * 100,
      width: Math.random() * 7 + 1,
      height: Math.random() * 40 + 30,
      color: isBlue
        ? `rgba(40, 82, 175, ${Math.random() * 0.5 + 0.3})`
        : `rgba(128, 0, 128, ${Math.random() * 0.5 + 0.3})`,
      speed: Math.random() * 8 + 7,
      delay: Math.random() * -5
    })
  }
}

const barStyle = (bar) => ({
  left: `${bar.position}%`,
  width: `${bar.width}%`,
  height: `${bar.height}%`,
  backgroundColor: bar.color,
  animationDuration: `${bar.speed}s`,
  animationDelay: `${bar.delay}s`
})

onMounted(() => {
  generateBars()
})
</script>

<style scoped>
 .dashboard {
      min-height: 100vh;
      position: relative;
      color: rgb(255, 255, 255);
      background:  linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5));
      background-size: cover;
      background-position: center;
      overflow: hidden;
    }
    
    .dashboard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit; 
  opacity: 0.3; 
  z-index: -1; 
}

    .custom-bg {
      background-color: rgb(14, 14, 14);
    }
        .ellipse {
      position: absolute;
      border-radius: 50%;
      filter: blur(200px); 
      z-index: 1;
      animation: pulseAndMove 10s infinite alternate ease-in-out;
    }
    
    .ellipse-blue {
      width: 40vw;
      height: 40vw;
      background-color: rgba(0, 80, 255, 0.7);
      top: 50%;
      left: 10%;
      animation-delay: -2s;
    }
    
    .ellipse-purple {
      width: 45vw;
      height: 45vw;
      background-color: rgba(170, 0, 255, 0.55);
      bottom: 1%;
      right: 5%;
      animation-delay: -5s;
    }
    
    @keyframes pulseAndMove {
      0% {
        transform: translateY(5%) scale(0.9);
        opacity: 0.55;
      }
      50% {
        transform: translateY(-10%) scale(1.05);
        opacity: 0.7;
      }
      100% {
        transform: translateY(-20%) scale(1);
        opacity: 0.6;
      }
    }
    
    .animated-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    
    .light-bar {
      position: absolute;
      bottom: 0;
      border-radius: 50px;
      filter: blur(9px);
      opacity: 0.6; 
      animation: moveUpDown  linear infinite alternate;
      transform-origin: bottom;
    }
    
    @keyframes moveUpDown {
      0% {
        transform: scaleY(0.8) translateY(5%);
      }
      100% {
        transform: scaleY(1.5) translateY(-25%);
      }
    }
    
    .content {
      position: relative;
      z-index: 2;
      height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 2rem;
    }
    
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4rem;
    }
    
    .logo {
      font-size: 2rem;
      font-weight: bold;
    }
    
    nav {
      display: flex;
      gap: 2rem;
    }
    
    nav a {
      color: white;
      text-decoration: none;
      font-size: 1rem;
      opacity: 0.8;
      transition: opacity 0.3s;
    }
    
    nav a:hover, nav a.active {
      opacity: 1;
    }
    
    main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-grow: 1;
      text-align: center;
    }
    
    h1 {
      font-size: 4rem;
      margin-bottom: 2rem;
    }
    
    .get-started {
      background-color: transparent;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.75rem 2rem;
      border-radius: 2rem;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }
    
    .get-started:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .arrow {
      font-size: 1.2rem;
    }
  </style>
