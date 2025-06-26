<template>
  <animated-background-layout>
    <div class="register-container">
        <div class="back-link">
            <RouterLink to="/" class="text-white">← Back to home</RouterLink>
        </div>
        <RegisterForm/>
    </div>
    


  </animated-background-layout>
</template>

<script setup>
import AnimatedBackgroundLayout from '@/layouts/AnimatedBackgroundLayout.vue';
import RegisterForm from '@/components/RegisterForm.vue';


</script>

<style>

</style>