<template>
  <WidgetWeatherHome :isDarkMode="isDarkMode"/>
</template>

<script setup>
import WidgetWeatherHome  from '@/components/WidgetWeatherHome.vue';


const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});
</script>

<style>

</style>