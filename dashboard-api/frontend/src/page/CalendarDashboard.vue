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
      {{ showForm ? 'Annuler' : 'Ajouter un événement' }}
    </button>

    <!-- Formulaire d'ajout -->
    <form v-if="showForm" @submit.prevent="addEvent" class="mb-6 p-4 rounded-lg shadow"
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
          <label class="block mb-1">Début</label>
          <input v-model="form.start" type="date" required class="w-full p-2 rounded border"
                 :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'" />
        </div>
        <div class="flex-1">
          <label class="block mb-1">Fin</label>
          <input v-model="form.end" type="date" required class="w-full p-2 rounded border"
                 :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'" />
        </div>
      </div>
      <button type="submit" class="mt-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
        Ajouter
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
          <label class="block mb-1">Début</label>
          <input v-model="form.start" type="date" required class="w-full p-2 rounded border"
                 :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'" />
        </div>
        <div class="flex-1">
          <label class="block mb-1">Fin</label>
          <input v-model="form.end" type="date" required class="w-full p-2 rounded border"
                 :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'" />
        </div>
      </div>
      <button type="submit" class="mt-2 px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700">
        Modifier
      </button>
      <button type="button" class="mt-2 ml-2 px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-700"
              @click="cancelEdit">
        Annuler
      </button>
    </form>

    <vue-cal
      ref="vuecal"
      style="height: 600px"
      :events="events"
      :time="false"
      default-view="month"
      :on-event-click="onEventClick"
      :class="isDarkMode ? 'bg-dark-card text-white' : 'bg-white text-gray-900'"
      @event-drop="onEventDrop"
      :drag-and-drop="true"
      :editable-events="{ 
        drag: true, 
        resize: true, 
        create: false, 
        delete: false,
        title: false 
      }"
      :snap-to-time="30"
      :disable-views="['years', 'year']"
      :events-on-month-view="'short'"
      :events-count-on-year-view="true"
      :cell-click-hold="false"
      :on-event-drag-create="false"
      :event-top-offset="0"
      :events-drag-and-drop="{ 
        enabled: true,
        validateEvent: true,
        createEvent: false
      }"
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

const vuecal = ref(null)

const testEvents = ref([
  { id: '1', title: 'Test', start: new Date(), end: new Date() }
])

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
    console.log('Events from API:', res.data);
    
    events.value = res.data.map(ev => {
      const mappedEvent = {
        _id: ev._id,
        id: ev._id, // vue-cal utilise id
        title: ev.title || '',
        content: ev.content || '',
        start: new Date(ev.start),
        end: new Date(ev.end),
        draggable: true,
        resizable: true
      };
      console.log('Mapped event:', mappedEvent);
      return mappedEvent;
    })
  } catch (e) {
    console.error('Erreur lors du chargement des événements:', e)
  }
}

const addEvent = async () => {
  try {
    await api.post('/events', form.value)
    showForm.value = false
    // Vide le formulaire
    form.value = { title: '', content: '', start: '', end: '' }
    await fetchEvents()
  } catch (e) {
    alert("Erreur lors de l'ajout de l'événement.")
    console.error(e)
  }
}

function onEventClick(event) {
  selectedEvent.value = event
  // Pré-remplir le formulaire pour édition
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

const onEventDrop = async (data) => {
  if(editMode.value) return;
  
  console.log('Event drop data complet:', {
    data,
    eventProps: data.event ? Object.keys(data.event) : 'No event',
    eventData: data.event,
    originalEvent: data.originalEvent
  });

  // Si data est un événement directement
  const event = data.event || data;
  
  // Vérifier que l'événement existe
  if (!event) {
    console.error('Erreur: Événement manquant');
    return;
  }

  console.log('Event properties:', {
    id: event.id,
    _id: event._id,
    allProps: Object.keys(event),
    fullEvent: event
  });

  // Vérifier que l'ID existe
  const eventId = event._id || event.id;
  if (!eventId) {
    console.error('Erreur: ID de l\'événement manquant', event);
    return;
  }

  try {
    // Créer une copie de l'événement pour éviter les modifications directes
    const updatedEvent = {
      title: event.title,
      content: event.content || '',
      start: new Date(event.start),
      end: new Date(event.end)
    };

    console.log('Updating event:', {
      eventId,
      updatedEvent,
      originalEvent: event
    });

    // Mettre à jour l'événement sur le serveur
    await api.put(`/events/${eventId}`, updatedEvent);
    
    // Rafraîchir les événements
    await fetchEvents();
  } catch (e) {
    console.error('Erreur détaillée:', e);
    alert("Erreur lors du déplacement de l'événement.");
    // En cas d'erreur, rafraîchir pour rétablir l'état initial
    await fetchEvents();
  }
}

function cancelEdit() {
  editMode.value = false
  selectedEvent.value = null
  form.value = { title: '', content: '', start: '', end: '' }
}

onMounted(fetchEvents)
</script>

<style>

</style>