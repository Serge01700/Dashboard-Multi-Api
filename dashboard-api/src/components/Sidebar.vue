<template>
  <nav :class="[
    'flex justify-center flex-col border p-2 w-[50px] rounded-3xl relative',
    isDarkMode ? 'bg-dark-card border-dark-border' : 'bg-dark border-light-border'
  ]">
    <ul class="space-y-2">
      <li v-for="(item, index) in menuItems" 
          :key="index" 
          class="relative p-2 rounded-full transition-all duration-300 group">
        <div class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             :class="isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-black/10 backdrop-blur-sm'">
        </div>
        <img :src="getImageUrl(item.icon)" 
             :alt="item.alt"
             class="relative z-10 h-6 w-6 transition-transform duration-300 group-hover:scale-110">
      </li>
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  isDarkMode: Boolean
});

const getImageUrl = (name) => {
  return new URL(`../assets/img/${name}`, import.meta.url).href;
}

const menuItems = [
  { icon: 'icons8-home-100.png', alt: 'Home' },
  { icon: 'icons8-increase-100.png', alt: 'Stats' },
  { icon: 'icons8-calendrier-50.png', alt: 'Calendar' },
  { icon: 'icons8-météo-pomme-50.png', alt: 'Weather' },
  { icon: 'icons8-to-do-100.png', alt: 'Todo' },
  { icon: 'icons8-email-96.png', alt: 'Email' },
  { icon: 'icons8-settings-100.png', alt: 'Settings' }
];
</script>

<style scoped>
/* Personnalisation du hover glassmorphism */
li > img {
  height: 24 px;
  object-fit: contain;
  cursor:pointer
}

</style>