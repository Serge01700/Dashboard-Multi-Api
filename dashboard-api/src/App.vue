<template>
<div>
   <div>
    <RouterView :isDarkMode="isDarkMode" @update:isDarkMode="toggleTheme"/>
    
   </div>
  
</div>



</template>

<script >
import WidgetWeather from './components/WidgetWeatherHome.vue'

import Sidebar from './components/Sidebar.vue';
import HomePage from './page/HomePage.vue';



export default {
    components:{
        WidgetWeather,
        Sidebar,
        HomePage
    },

    data(){
        return{
            isDarkMode: true
        }
    },

    methods: {
        toggleTheme(){
            this.isDarkMode = !this.isDarkMode
        }
    }
}
</script>

<style>
*{
    font-family: GT;
}


</style>