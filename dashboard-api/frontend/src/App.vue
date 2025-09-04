<template>
<div>
   <div>
    <RouterView :isDarkMode="isDarkMode" @update:isDarkMode="toggleTheme"/>
    
   </div>
  
</div>



</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import WidgetWeather from './components/WidgetWeatherHome.vue'
import Sidebar from './components/Sidebar.vue'
import HomePage from './page/HomePage.vue'

const authStore = useAuthStore()
const isDarkMode = ref(true)

const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
}

onMounted(async () => {
    await authStore.init()
})
</script>

<style>
*{
    font-family: GT;
}


</style>