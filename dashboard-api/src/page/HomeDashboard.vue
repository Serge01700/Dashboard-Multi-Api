<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
    <WidgetWeatherHome :isDarkMode="isDarkMode"/>
    <RecentTasks :isDarkMode="isDarkMode" />
  </div>
</template>

<script setup>
import WidgetWeatherHome from '@/components/WidgetWeatherHome.vue';
import RecentTasks from '@/components/RecentTasks.vue';

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});
</script>

<style>

</style>