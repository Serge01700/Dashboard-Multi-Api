<template>
  <div class="mb-8">
    <h2 class="text-xl font-thin mb-4 capitalize"
      :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
      {{ genre }}
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="track in tracks" :key="track.trackId"
        class="rounded-xl border p-4 transition-all duration-300 cursor-pointer" 
        :class="[
          isDarkMode 
            ? 'bg-dark-card border-dark-border text-dark-text-primary' 
            : 'bg-light-card border-light-border text-light-text-primary'
        ]">
        <img :src="track.artworkUrl100.replace('100x100', '300x300')" 
             :alt="track.trackName"
             class="w-full h-48 object-cover rounded-lg mb-4">
        <div class="space-y-2">
          <h3 class="font-semibold truncate">{{ track.trackName }}</h3>
          <p class="text-sm opacity-75">{{ track.artistName }}</p>
          <audio :src="track.previewUrl" controls class="w-full mt-2"></audio>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  genre: {
    type: String,
    required: true
  },
  tracks: {
    type: Array,
    required: true
  },
  isDarkMode: {
    type: Boolean,
    required: true
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
</style> 