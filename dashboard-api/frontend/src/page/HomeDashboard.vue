<template>
  <div class="flex flex-col h-full">
    <!-- En-tête -->
    <header class="w-full flex justify-between items-center">
      <TopHomeDashboard :isDarkMode="isDarkMode" />
      <TimeTraker :isDarkMode="isDarkMode" />
    </header>

    <!-- Zone de contenu principal -->
    <main class="flex-1">
      <div class="px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 h-full" style="width:100%">
        <draggable v-model="widgets" item-key="id" class="contents">
          <template #item="{ element }">
            <div class="h-full min-h-[250px] flex flex-col justify-stretch items-stretch">
              <component :is="element.component" :isDarkMode="isDarkMode" class="h-full w-full" />
            </div>
          </template>
        </draggable>
      </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, markRaw, watch } from 'vue';
import { useDashboardOrderStore } from '@/stores/dashboardOrder';
import draggable from 'vuedraggable';
import TimeTraker from '@/components/TimeTraker.vue';
import WidgetWeatherHome from '@/components/WidgetWeatherHome.vue';
import RecentTasks from '@/components/RecentTasks.vue';
import TopHomeDashboard from '@/components/TopHomeDashboard.vue';
import CurrencyConverter from '@/components/CurrencyConverter.vue';
import UpcomingEvents from '@/components/UpcomingEvents.vue';
import ApiMetric from '@/components/ApiMetric.vue';

const dashboardOrderStore = useDashboardOrderStore();

const widgets = ref([]);

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});


onMounted(() => {
  const defaultOrder = [
    { id: 1, name: 'Weather', component: markRaw(WidgetWeatherHome) },
    { id: 2, name: 'Tasks', component: markRaw(RecentTasks) },
    { id: 3, name: 'API', component: markRaw(ApiMetric) },
    { id: 4, name: 'Currency', component: markRaw(CurrencyConverter) },
    { id: 5, name: 'Events', component: markRaw(UpcomingEvents) }
  ];
  // Restaure l'ordre depuis le store
  const restored = dashboardOrderStore.restore(defaultOrder);
  // Réassocie la référence du composant Vue à chaque widget
  widgets.value = restored.map(widget => {
    switch (widget.name) {
      case 'Weather':
        return { ...widget, component: markRaw(WidgetWeatherHome) };
      case 'Tasks':
        return { ...widget, component: markRaw(RecentTasks) };
      case 'API':
        return { ...widget, component: markRaw(ApiMetric) };
      case 'Currency':
        return { ...widget, component: markRaw(CurrencyConverter) };
      case 'Events':
        return { ...widget, component: markRaw(UpcomingEvents) };
      default:
        return widget;
    }
  });
});


watch(widgets, (newOrder) => {
  dashboardOrderStore.save(newOrder);
}, { deep: true });


</script>