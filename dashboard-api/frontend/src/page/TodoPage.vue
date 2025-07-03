<template>
  <div :class="['shadow p-5 rounded-lg tewt-white',
    isDarkMode ? 'bg-dark-card text-white' : 'bg-light-card text-gray-800 ' ,
  
  ]">
    <div class="mb-6">
      <h1 class="text-3xl font-bold ">Gestionnaire de Tâches</h1>
      <p class="text-gray-400 mt-2">Gérez vos tâches quotidiennes efficacement</p>
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

</style> 