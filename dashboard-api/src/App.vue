<template>
<div>
    <AnimatedBackground />
    
    <WidgetWeather  class="hidden"/>
    <Sidebar />
  
</div>



</template>

<script >
import WidgetWeather from './components/WidgetWeatherHome.vue'
import DashboardLayout from './layout/DashboardLayout.vue';
import Sidebar from './components/Sidebar.vue';
import AnimatedBackground from './components/AnimatedBackground.vue';



export default {
    components:{
        WidgetWeather,
        DashboardLayout,
        Sidebar,
        AnimatedBackground
    }
}
</script>

<style>
*{
    font-family: GT;
}


</style>