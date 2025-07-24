<template>
  <div class="w-full h-full p-4">
    <!-- En-tête -->
    <Transition
      appear
      enter-active-class="transition duration-700 ease-out"
      enter-from-class="opacity-0 translate-y-20"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div class="mb-8">
        <h1 class="text-3xl font-thin mb-2"
          :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
          Discover the music
        </h1>
        <p class="text-sm opacity-75 mb-4"
          :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
          The best titles of the moment
        </p>

        <!-- Barre de recherche -->
        <div class="flex gap-2">
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            placeholder="Search for an artist or song..."
            class="flex-1 px-4 py-2 rounded-lg border"
            :class="[
              isDarkMode 
                ? 'bg-dark-card border-dark-border text-dark-text-primary' 
                : 'bg-light-card border-light-border text-light-text-primary'
            ]"
          />
          <button
            @click="handleSearch"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            :disabled="loading"
          >
            Search
          </button>
        </div>
      </div>
    </Transition>

    <!-- Sections de musique -->
    <TransitionGroup
      appear
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 translate-x-20"
      enter-to-class="opacity-100 translate-x-0"
      move-class="transition duration-500"
      class="space-y-8"
    >
      <MusicGenreSection
        v-for="(tracks, genre) in musicByGenre"
        :key="genre"
        :genre="genre"
        :tracks="tracks"
        :isDarkMode="isDarkMode"
      />
    </TransitionGroup>

    <!-- Message de chargement -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="loading" 
        class="flex justify-center items-center mt-8"
        :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span class="ml-2">Loading...</span>
      </div>
    </Transition>

    <!-- Message d'erreur -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="error" 
        class="flex flex-col items-center justify-center mt-8 p-4 rounded-lg"
        :class="[isDarkMode ? 'bg-red-900/20' : 'bg-red-100']">
        <p class="text-red-500 text-center mb-4">{{ error }}</p>
        <button 
          @click="loadInitialMusic"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Try again
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, Transition, TransitionGroup } from 'vue';
import { musicService } from '@/services/music';
import MusicGenreSection from '@/components/MusicGenreSection.vue';

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});

const musicByGenre = ref({});
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');

const GENRES = ['pop'];  // On commence avec un seul genre pour tester

const loadInitialMusic = async () => {
  if (loading.value) return; // Éviter les appels multiples pendant le chargement
  
  loading.value = true;
  error.value = null;
  musicByGenre.value = {};

  try {
    const results = await musicService.fetchMultipleGenres(GENRES);
    GENRES.forEach((genre, index) => {
      // Ne mettre à jour que si nous avons des résultats
      if (results[index] && results[index].length > 0) {
        musicByGenre.value[genre] = results[index];
      }
    });

    // Vérifier si nous avons au moins un genre avec des résultats
    if (Object.keys(musicByGenre.value).length === 0) {
      error.value = 'No results found for the selected music genres.';
    }
  } catch (err) {
    error.value = err.message || 'An error occurred while loading music. Please try again.';
    console.error('Erreur de chargement:', err);
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  if (!searchQuery.value.trim() || loading.value) return;

  loading.value = true;
  error.value = null;
  musicByGenre.value = {};

  try {
    const results = await musicService.fetchMusicByGenre(searchQuery.value.trim());
    if (results && results.length > 0) {
      musicByGenre.value['Search Results'] = results;
    } else {
      error.value = 'No results found for your search.';
    }
  } catch (err) {
    error.value = err.message || 'An error occurred during the search. Please try again.';
    console.error('Erreur de recherche:', err);
  } finally {
    loading.value = false;
  }
};

// Utiliser un délai avant de recharger en cas d'erreur
let retryTimeout = null;

onMounted(() => {
  loadInitialMusic();
});

onUnmounted(() => {
  if (retryTimeout) {
    clearTimeout(retryTimeout);
  }
});
</script>

<style scoped>
audio {
  height: 32px;
  border-radius: 20px;
}

audio::-webkit-media-controls-panel {
  border-radius: 20px;
}

/* Transitions pour les sections de musique */
.section-enter-active,
.section-leave-active {
  transition: all 0.5s ease;
}

.section-enter-from,
.section-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.section-move {
  transition: transform 0.5s ease;
}
</style>