<template>
  <div 
    class="relative z-20 w-full max-w-lg p-5 m-4 backdrop-blur-md transition-all duration-300 rounded-3xl border h-[250px] md:h-[210px] flex flex-col" 
    :class="[
      isDarkMode 
        ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
        : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
    ]"
  >
    <!-- En-tête fixe -->
    <div class="mb-6">
      <p class="date ml-1 mb-1 text-base md:text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
        {{ currentDate }}
      </p>
      <div class="flex items-center justify-between">
        <h3 class="text-2xl md:text-lg font-light ml-1" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
          Recent Tasks
        </h3>
        <router-link to="todo" class="text-sm text-gray-500 font-medium transition-colors hover:text-blue-500">
          View All
        </router-link>
      </div>
    </div>
    
    <!-- Zone scrollable -->
    <div class="flex-1 overflow-y-auto pr-2">
      <div class="space-y-3">
        <div v-for="(task, index) in recentTasks" :key="index"
             class="flex items-center justify-between p-3 rounded-lg transition-all duration-300"
             :class="isDarkMode ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'">
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="task.completed"
              @change="updateTask(index)"
              class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span :class="[
              task.completed ? 'line-through' : '',
              isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'
            ]">
              {{ task.text }}
            </span>
          </div>
          <span class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
            {{ formatDate(task.date) }}
          </span>
        </div>
        
        <div v-if="recentTasks.length === 0" 
             class="text-center py-3"
             :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
          Aucune tâche récente
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecentTasks',
  props: {
    isDarkMode: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      recentTasks: []
    }
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('en-EN', {
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      });
    }
  },
  methods: {
    loadTasks() {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        this.recentTasks = JSON.parse(savedTasks).slice(0, 5);
      }
    },
    updateTask(index) {
      const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const taskIndex = allTasks.findIndex(t => t.text === this.recentTasks[index].text);
      if (taskIndex !== -1) {
        allTasks[taskIndex] = this.recentTasks[index];
        localStorage.setItem('tasks', JSON.stringify(allTasks));
        window.dispatchEvent(new Event('storage'));
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-EN', {
        day: 'numeric',
        month: 'short'
      });
    }
  },
  mounted() {
    this.loadTasks();
    window.addEventListener('storage', this.loadTasks);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.loadTasks);
  }
}
</script>

<style scoped>
.recent-tasks-container {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  border: 1px solid rgba(209, 213, 219, 0.3);
  padding: 1.5rem;
  height: 100%;
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



</style>