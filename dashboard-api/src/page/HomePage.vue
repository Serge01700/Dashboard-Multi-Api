<template>
  <AnimatedBackgroundLayout>
    <header>
      <div class="logo">Dash.</div>
      <nav>
        <router-link to="/" class="active">Home</router-link>
        <router-link to="/dashboard/settings">About us</router-link>
        <router-link to="/login">Sign-in</router-link>
      </nav>
    </header>
    <main>
      <h1>Dashboard Multi-Api</h1>
      <RouterLink to="/login">
        <button class="get-started">
          Get started
          <span class="arrow">↗</span>
        </button>
      </RouterLink>
        
    </main>
  </AnimatedBackgroundLayout>
</template>

<script setup>
import AnimatedBackgroundLayout from '@/layouts/AnimatedBackgroundLayout.vue'
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
  background: inherit; /* Hérite de l'image de fond */
  opacity: 0.3; /* Ajuste l'opacité de l'image */
  z-index: -1; 
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