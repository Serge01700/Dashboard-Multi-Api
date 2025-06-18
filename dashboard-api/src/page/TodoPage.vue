<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Gestionnaire de Tâches</h1>
      <p class="text-gray-600 mt-2">Gérez vos tâches quotidiennes efficacement</p>
    </div>
    <TodoList :isDarkMode="isDarkMode" />
  </div>
</template>

<script>
import TodoList from '../components/TodoList.vue'

export default {
  name: 'TodoPage',
  components: {
    TodoList
  },
  props: {
    isDarkMode: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>
.p-6 {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  border: 1px solid rgba(209, 213, 219, 0.3);
}
</style> 