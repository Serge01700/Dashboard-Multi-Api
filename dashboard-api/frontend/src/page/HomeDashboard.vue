<template>
  <!-- Container principal -->
  <div class="flex flex-col h-full">
    <!-- En-tête -->
    <header class="w-full flex justify-between items-center">
      <TopHomeDashboard :isDarkMode="isDarkMode" />
      <TimeTraker :isDarkMode="isDarkMode" />
    </header>

    <!-- Zone de contenu principal -->
    <main class="flex-1">
      <div class="grid md:grid-cols-3 gap-4 px-6">
        <!-- Widgets -->
          <WidgetWeatherHome :isDarkMode="isDarkMode" />
          <RecentTasks :isDarkMode="isDarkMode" />
        
          <ApiMetric :isDarkMode="isDarkMode" />
          
        
       
          <CurrencyConverter class="mx-8 w-full" :isDarkMode="isDarkMode" />
          <UpcomingEvents class="mx-8" :isDarkMode="isDarkMode" />
        
      </div>
    </main>
  </div>
</template>

<script setup>
import ApiMetric from '@/components/ApiMetric.vue';
import TimeTraker from '@/components/TimeTraker.vue';
import WidgetWeatherHome from '@/components/WidgetWeatherHome.vue';
import RecentTasks from '@/components/RecentTasks.vue';
import TopHomeDashboard from '@/components/TopHomeDashboard.vue';
import CurrencyConverter from '@/components/CurrencyConverter.vue';
import UpcomingEvents from '@/components/UpcomingEvents.vue';

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});
</script>

<style>

</style>