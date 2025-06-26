<template>
  <AnimatedBackgroundLayout>
    <div class="login-container">
      <div class="back-link">
        <RouterLink to="/" class="text-white">← Back to home</RouterLink>  
      </div>
      <LoginForm />
    </div>
  </AnimatedBackgroundLayout>
</template>

<script setup>
import AnimatedBackgroundLayout from '@/layouts/AnimatedBackgroundLayout.vue';
import LoginForm from '@/components/LoginForm.vue';
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.back-link {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
}

.back-link a {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.back-link a:hover {
  opacity: 1;
}
</style>