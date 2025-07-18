<template>
  <div class="random-music overflow-y-auto relative z-20 w-full max-w-lg p-5 m-4 backdrop-blur-md transition-all duration-300 rounded-3xl border h-[250px] md:h-[210px]"
    :class="[
      isDarkMode 
        ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
        : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
    ]">
    <div class="flex justify-between items-center">
      <p class="text-2xl mb-5 md:text-lg font-light" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Discover the Music</p>
      <button @click="loadRandomMusic" class="p-2 rounded-full hover:bg-opacity-20" :class="isDarkMode ? 'hover:bg-dark-border' : 'hover:bg-light-border'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <div v-if="currentMusic" class="bg-dark-2 rounded-lg p-4" :class="isDarkMode ? 'bg-dark-2' : 'bg-light-2'">
      <div class="flex gap-4">
        <img :src="currentMusic.artwork" alt="Album artwork" class="w-16 h-16 rounded-lg object-cover">
        <div class="flex flex-col flex-1">
          <p class="text-lg font-semibold truncate" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">
            {{ currentMusic.title }}
          </p>
          <p class="text-sm truncate" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
            {{ currentMusic.artist }}
          </p>
          <p class="text-xs" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
            Genre: {{ currentMusic.genre }}
          </p>
          <div class="flex items-center gap-2 mt-2">
            <button @click="togglePlay" class="p-2 rounded-full hover:bg-opacity-20" :class="isDarkMode ? 'hover:bg-dark-border text-dark-text-primary' : 'hover:bg-light-border text-light-text-primary'">
              <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div class="flex-1 h-1 bg-gray-200 rounded">
              <div class="h-full bg-blue-500 rounded" :style="{ width: `${progress}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex justify-center items-center h-[150px]">
      <p class="text-sm" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">
        Loading music...
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { musicService } from '@/services/music.js';

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});

const currentMusic = ref(null);
const isPlaying = ref(false);
const progress = ref(0);
let audioPlayer = null;

const genres = ['pop', 'rock', 'jazz', 'classical'];

const loadRandomMusic = async () => {
  try {
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer = null;
    }
    isPlaying.value = false;
    progress.value = 0;
    currentMusic.value = null;

    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    const musicList = await musicService.fetchMusicByGenre(randomGenre);
    
    if (musicList && musicList.length > 0) {
      const randomIndex = Math.floor(Math.random() * musicList.length);
      const track = musicList[randomIndex];
      
      if (!track.previewUrl) {
        throw new Error('No preview available for this track');
      }

      currentMusic.value = {
        title: track.trackName,
        artist: track.artistName,
        genre: track.primaryGenreName,
        previewUrl: track.previewUrl,
        artwork: track.artworkUrl100
      };

      audioPlayer = new Audio(currentMusic.value.previewUrl);
      
      audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
          progress.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        }
      });

      audioPlayer.addEventListener('ended', () => {
        isPlaying.value = false;
        progress.value = 0;
        loadRandomMusic();
      });

      audioPlayer.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        loadRandomMusic();
      });
    }
  } catch (error) {
    console.error('Error loading random music:', error);
    currentMusic.value = null;
  }
};

const togglePlay = async () => {
  if (!audioPlayer || !currentMusic.value) {
    await loadRandomMusic();
    return;
  }
  
  try {
    if (isPlaying.value) {
      await audioPlayer.pause();
    } else {
      const playPromise = audioPlayer.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
    }
    isPlaying.value = !isPlaying.value;
  } catch (error) {
    console.error('Error toggling playback:', error);
    isPlaying.value = false;
  }
};

onMounted(() => {
  loadRandomMusic();
});

onUnmounted(() => {
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.remove();
    audioPlayer = null;
  }
});
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 3px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style> 