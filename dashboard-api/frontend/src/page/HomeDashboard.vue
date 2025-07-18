<template>
  <div class="flex flex-col h-full">
    <!-- En-tête -->
    <header class="w-full flex justify-between items-center">
      <TopHomeDashboard :isDarkMode="isDarkMode" />
      <Transition
              appear
              :style="{ '--delay': `${index * 150}ms` }"
              enter-active-class="transition duration-700 ease-out"
              enter-from-class="opacity-0 -translate-y-20"
              enter-to-class="opacity-100 -translate-y-0"
              leave-active-class="transition duration-500 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
            <TimeTraker :isDarkMode="isDarkMode" />
          </Transition>
      
    </header>

    <!-- Zone de contenu principal -->
    <main class="flex-1">
      <div class="px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 h-full w-full">
        <draggable v-model="widgets" item-key="id" class="contents">
          <template #item="{ element, index }">
            <Transition
              appear
              :style="{ '--delay': `${index * 150}ms` }"
              enter-active-class="transition duration-700 ease-out"
              enter-from-class="opacity-0 translate-x-80"
              enter-to-class="opacity-100 translate-x-0"
              leave-active-class="transition duration-500 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div class="cursor-move h-full min-h-[250px] flex flex-col justify-stretch items-stretch transform transition-all duration-300 hover:scale-[1.02]">
                <component :is="element.component" :isDarkMode="isDarkMode" class="h-full w-full" />
              </div>
            </Transition>
          </template>
        </draggable>
      </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, markRaw, watch, Transition } from 'vue';
import { useDashboardOrderStore } from '@/stores/dashboardOrder';
import draggable from 'vuedraggable';
import TimeTraker from '@/components/TimeTraker.vue';
import WidgetWeatherHome from '@/components/WidgetWeatherHome.vue';
import RecentTasks from '@/components/RecentTasks.vue';
import TopHomeDashboard from '@/components/TopHomeDashboard.vue';
import CurrencyConverter from '@/components/CurrencyConverter.vue';
import UpcomingEvents from '@/components/UpcomingEvents.vue';
import ApiMetric from '@/components/ApiMetric.vue';
import RandomMusic from '@/components/RandomMusic.vue';

const dashboardOrderStore = useDashboardOrderStore();
const widgets = ref([]);

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});

const defaultOrder = [
  { id: 1, name: 'Weather', component: markRaw(WidgetWeatherHome) },
  { id: 2, name: 'Tasks', component: markRaw(RecentTasks) },
  { id: 3, name: 'API', component: markRaw(ApiMetric) },
  { id: 4, name: 'Currency', component: markRaw(CurrencyConverter) },
  { id: 5, name: 'Events', component: markRaw(UpcomingEvents) },
  { id: 6, name: 'Music', component: markRaw(RandomMusic) }
];

onMounted(() => {
  // Force reset the dashboard order to include the new music widget
  dashboardOrderStore.reset(defaultOrder);
  
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
      case 'Music':
        return { ...widget, component: markRaw(RandomMusic) };
      default:
        return widget;
    }
  });
});

watch(widgets, (newOrder) => {
  dashboardOrderStore.save(newOrder);
}, { deep: true });


</script>