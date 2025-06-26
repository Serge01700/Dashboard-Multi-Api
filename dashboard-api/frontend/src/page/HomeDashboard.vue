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
      <div class="grid  md:grid-cols-3 gap-5 px-2 ">
        <!-- Widgets -->
        <WidgetWeatherHome :isDarkMode="isDarkMode" />
        <RecentTasks :isDarkMode="isDarkMode" />
        <div class="flex flex-col">
          <ApiMetric :isDarkMode="isDarkMode" />
        </div>
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

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});
</script>

<style>

</style>