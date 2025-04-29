<template>
<div>
    
    <WidgetWeather  class="hidden"/>
    <Sidebar />
  
</div>



</template>

<script >
import WidgetWeather from './components/WidgetWeatherHome.vue'
import DashboardLayout from './layout/DashboardLayout.vue';
import Sidebar from './components/Sidebar.vue';



export default {
    components:{
        WidgetWeather,
        DashboardLayout,
        Sidebar
    }
}
</script>

<style>
*{
    font-family: GT;
}


</style>