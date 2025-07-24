<template>
  <div 
    class="relative z-20 w-full max-w-sm p-5 m-4 backdrop-blur-md transition-all duration-300 rounded-3xl border"
    :class="[
      isDarkMode 
        ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
        : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
    ]"
  >
    <Transition
      appear
      enter-active-class="transition duration-700 ease-out"
      enter-from-class="opacity-0 -translate-y-20"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-500 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div class="mb-6">
        <p class="date ml-1 mb-1" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
          {{ currentDate }}
        </p>
        <h2 class="text-2xl font-light ml-1" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
          Mes Tâches
        </h2>
        
        <div class="flex gap-2 mt-5">
          <input 
            v-model="newTask" 
            type="text" 
            placeholder="Ajouter une nouvelle tâche" 
            class="flex-1 p-2 rounded-lg focus:outline-none border transition-all duration-300"
            :class="isDarkMode ? 'bg-dark-card border-dark-border text-dark-text-primary' : 'bg-light border-light-border text-light-text-primary'"
            @keyup.enter="addTask"
          />
          <button 
            @click="addTask" 
            class="px-4 py-2 rounded-lg transition-all duration-300"
            :class="isDarkMode ? 'bg-dark-card border-dark-border text-dark-text-primary shadow-dark-shadow hover:shadow-dark-shadow-hover' : 'bg-light border-light-border text-light-text-primary shadow-light-shadow hover:shadow-light-shadow-hover'"
          >
            Ajouter
          </button>
        </div>
      </div>
    </Transition>

    <TransitionGroup
      name="list"
      tag="div"
      class="space-y-3"
    >
      <div v-for="(task, index) in tasks" :key="task.id || index" 
           class="flex items-center justify-between p-3 rounded-lg transition-all duration-300"
           :class="isDarkMode ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'"
           :style="{ '--delay': `${index * 100}ms` }"
      >
        <div class="flex items-center gap-3">
          <input 
            type="checkbox" 
            v-model="task.completed"
            class="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span :class="[
            task.completed ? 'line-through' : '',
            isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'
          ]">
            {{ task.text }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
            {{ formatDate(task.date) }}
          </span>
          <button 
            @click="deleteTask(index)"
            class="text-red-500 hover:text-red-600 p-1"
          >
            <span class="sr-only">Supprimer</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div v-if="tasks.length === 0" 
           key="empty"
           class="text-center py-3"
           :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
        Aucune tâche pour le moment
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
})

const newTask = ref('')
const tasks = ref([])

const currentDate = computed(() => {
  return new Date().toLocaleDateString('fr-FR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  })
})

function addTask() {
  if (newTask.value.trim()) {
    tasks.value.unshift({
      id: Date.now(),
      text: newTask.value,
      completed: false,
      date: new Date()
    })
    newTask.value = ''
    saveTasks()
  }
}

function deleteTask(index) {
  tasks.value.splice(index, 1)
  saveTasks()
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks.value))
  window.dispatchEvent(new Event('storage'))
}

function loadTasks() {
  const savedTasks = localStorage.getItem('tasks')
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks)
  }
}

onMounted(() => {
  loadTasks()
  window.addEventListener('storage', loadTasks)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', loadTasks)
})
</script>

<style scoped>
.todo-container {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  border: 1px solid rgba(209, 213, 219, 0.3);
  padding: 1.5rem;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(209, 213, 219, 0.2);
  transition: all 0.3s ease;
}

.task-item:hover {
  background-color: rgba(255, 255, 255, 0.7);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Transitions pour la liste */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Pour assurer que les éléments qui bougent le font de manière fluide */
.list-leave-active {
  position: absolute;
}

/* Animation delay utilities */
.delay-100 {
  transition-delay: 100ms;
}

.delay-200 {
  transition-delay: 200ms;
}

.delay-300 {
  transition-delay: 300ms;
}
</style> 