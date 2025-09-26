<template>
  <div class="m-4 w-full md:h-[210px] max-w-lg p-4 rounded-3xl border shadow-dark-shadow hover:shadow-dark-shadow-hover"
       :class="[isDarkMode ? 'border-dark-border bg-dark-card text-dark-text-primary' : 'border-light-border bg-light-card text-light-text-primary']">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-thin">Next events</h2>
      <RouterLink to="/dashboard/calendar" class="text-gray-500 hover:text-blue-600 text-sm">View all</RouterLink>
    </div>
    
    <div class="space-y-3">
      <div v-if="loading" class="text-center py-4">
        Loading...
      </div>
      
      <div v-else-if="upcomingEvents.length === 0" class="text-center py-4">
        No upcoming events
      </div>
      
      <div v-else v-for="event in upcomingEvents" :key="event._id"
           class="flex items-center p-3 rounded-lg transition-all"
           :class="[isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100']">
        <div class="flex-1">
          <h3 class="font-medium">{{ event.title }}</h3>
          <p class="text-sm opacity-70">
            {{ new Date(event.start).toLocaleDateString('fr-FR') }}
          </p>
        </div>
        <div class="ml-4 flex items-center gap-2">
          <button @click="confirmDelete(event._id)"
                  title="Supprimer"
                  class="text-sm px-2 py-1 rounded flex items-center justify-center"
                  :class="[isDarkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600']">
            <span class="sr-only">Supprimer</span>
            <span aria-hidden="true">🗑️</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/services/axios-config'

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
})

const upcomingEvents = ref([])
const loading = ref(true)

const fetchUpcomingEvents = async () => {
  try {
    loading.value = true
    const res = await api.get('/events')
    // Filtrer pour n'avoir que les événements à venir et les trier par date
    const now = new Date()
    upcomingEvents.value = res.data
      .filter(event => new Date(event.start) >= now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 2) // Limiter à 3 événements
  } catch (error) {
    console.error('Error loading events:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUpcomingEvents()
})

const deleteEvent = async (id) => {
  try {
    await api.delete(`/events/${id}`)
    // rafraîchir
    await fetchUpcomingEvents()
  } catch (err) {
    console.error('Error deleting event:', err)
  }
}

const confirmDelete = (id) => {
  if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
    deleteEvent(id)
  }
}
</script> 