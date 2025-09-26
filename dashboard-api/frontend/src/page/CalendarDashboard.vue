<template>
  <div :class="['p-6 rounded-lg min-h-screen', isDarkMode ? 'bg-dark-card' : 'bg-white']">
    <h1 class="text-2xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
     Calendar
    </h1>
    <!-- Bouton d'ajout -->
    <button
      class=" bg-dark-card mb-4 px-4 py-2 rounded bg-blue-600 text-white"
      @click="showForm = !showForm"
    >
      {{ showForm ? 'Cancel' : 'Add an event' }}
    </button>

    <!-- Formulaire d'ajout -->
    <form v-if="showForm" @submit.prevent="addEvent" class="mb-6 p-4 rounded-lg shadow"
          :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'">
      <div class="mb-2">
        <label class="block mb-1">Title</label>
        <input v-model="form.title" required class="w-full p-2 rounded border"
               :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'" />
      </div>
      <div class="mb-2">
        <label class="block mb-1">Description</label>
        <textarea v-model="form.content" class="w-full p-2 rounded border"
                  :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"></textarea>
      </div>
      <div class="mb-2 flex gap-4">
        <div class="flex-1">
          <label class="block mb-1">Start</label>
          <input v-model="form.start" type="date" required class="w-full p-2 rounded border"
                 :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'" />
        </div>
        <div class="flex-1">
          <label class="block mb-1">End</label>
          <input v-model="form.end" type="date" required class="w-full p-2 rounded border"
                 :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'" />
        </div>
      </div>
      <button type="submit" class="mt-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
        Add
      </button>
    </form>

    <!-- Formulaire d'édition -->
    <form v-if="editMode" @submit.prevent="updateEvent" class="mb-6 p-4 rounded-lg shadow"
          :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'">
      <div class="mb-2">
        <label class="block mb-1">Titre</label>
        <input v-model="form.title" required class="w-full p-2 rounded border"
               :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'" />
      </div>
      <div class="mb-2">
        <label class="block mb-1">Description</label>
        <textarea v-model="form.content" class="w-full p-2 rounded border"
                  :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"></textarea>
      </div>
      <div class="mb-2 flex gap-4">
        <div class="flex-1">
          <label class="block mb-1">Start</label>
          <input v-model="form.start" type="date" required class="w-full p-2 rounded border"
                 :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'" />
        </div>
        <div class="flex-1">
          <label class="block mb-1">End</label>
          <input v-model="form.end" type="date" required class="w-full p-2 rounded border"
                 :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'" />
        </div>
      </div>
      <button type="submit" class="mt-2 px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700">
        Edit
      </button>
      <button type="button" class="mt-2 ml-2 px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-700"
              @click="cancelEdit">
        Cancel
      </button>
    </form>

    <vue-cal
      style="height: 600px"
      :events="events"
      :time="false"
      default-view="month"
      :on-event-click="onEventClick"
      :class="isDarkMode ? 'bg-dark-card text-white' : 'bg-white text-gray-900'"
    />
    <div v-if="selectedEvent" class="mt-6 p-4 rounded-lg shadow-lg"
         :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'">
      <h2 class="text-xl font-bold mb-2">{{ selectedEvent.title }}</h2>
      <p class="mb-2">{{ selectedEvent.content }}</p>
      <p class="text-sm">
        Date start: {{ new Date(selectedEvent.start).toLocaleDateString('fr-FR') }}
      </p>
      <p class="text-sm">
        Date end : {{ new Date(selectedEvent.end).toLocaleDateString('fr-FR') }}
      </p>
      <button class="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              @click="selectedEvent = null">
        Fermer
      </button>
      <button class="mt-4 ml-2 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              @click="confirmDeleteSelected">
        Supprimer
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import api from '@/services/axios-config'

const props = defineProps({
  isDarkMode: Boolean
})

const events = ref([])
const selectedEvent = ref(null)
const showForm = ref(false)
const editMode = ref(false)
const form = ref({
  title: '',
  content: '',
  start: '',
  end: ''
})

const fetchEvents = async () => {
  try {
    const res = await api.get('/events')
    events.value = res.data.map(ev => ({
      ...ev,
      id: ev._id,
      start: new Date(ev.start),
      end: new Date(ev.end)
    }))
  } catch (e) {
    console.error('Erreur lors du chargement des événements:', e)
  }
}

const addEvent = async () => {
  try {
    await api.post('/events', form.value)
    showForm.value = false
    form.value = { title: '', content: '', start: '', end: '' }
    await fetchEvents()
  } catch (e) {
    alert("Erreur lors de l'ajout de l'événement.")
    console.error(e)
  }
}

function onEventClick(event) {
  selectedEvent.value = event
  form.value = {
    title: event.title,
    content: event.content,
    start: event.start ? new Date(event.start).toISOString().slice(0, 10) : '',
    end: event.end ? new Date(event.end).toISOString().slice(0, 10) : ''
  }
  editMode.value = true
}

const updateEvent = async () => {
  try {
    await api.put(`/events/${selectedEvent.value._id}`, form.value)
    editMode.value = false
    selectedEvent.value = null
    form.value = { title: '', content: '', start: '', end: '' }
    await fetchEvents()
  } catch (e) {
    alert("Erreur lors de la modification de l'événement.")
    console.error(e)
  }
}

function cancelEdit() {
  editMode.value = false
  selectedEvent.value = null
  form.value = { title: '', content: '', start: '', end: '' }
}

const deleteEvent = async (id) => {
  try {
    await api.delete(`/events/${id}`)
    selectedEvent.value = null
    await fetchEvents()
  } catch (e) {
    console.error('Erreur lors de la suppression :', e)
    alert("Erreur lors de la suppression de l'événement.")
  }
}

const confirmDeleteSelected = () => {
  if (!selectedEvent.value) return
  if (confirm("Voulez-vous supprimer cet événement ?")) {
    deleteEvent(selectedEvent.value._id)
  }
}

onMounted(fetchEvents)
</script>

<style>
</style>