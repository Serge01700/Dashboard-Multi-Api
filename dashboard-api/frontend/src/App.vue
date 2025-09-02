<template>
<div>
   <div>
    <RouterView :isDarkMode="isDarkMode" @update:isDarkMode="toggleTheme"/>
    
   </div>
  
</div>



</template>

<script setup>
import { ref } from 'vue'
import WidgetWeather from './components/WidgetWeatherHome.vue'
import Sidebar from './components/Sidebar.vue'
import HomePage from './page/HomePage.vue'

const isDarkMode = ref(true)

const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
}
</script>

<style>
*{
    font-family: GT;
}


</style>