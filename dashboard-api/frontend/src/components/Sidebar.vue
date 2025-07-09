<template>
  <nav
    :class="[
    'flex justify-center flex-row md:flex-col border p-2 w-auto md:w-[50px] rounded-3xl relative',
    isDarkMode ? 'bg-dark-card border-dark-border' : 'bg-dark border-light-border'
   ]">
    <ul class="flex flex-row md:flex-col space-y-0 md:space-y-2 space-x-2 md:space-x-0">
      <li v-for="(item, index) in menuItems" 
          :key="index" 
          class="relative p-2 rounded-full transition-all duration-300 group">
        <div class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             :class="isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-black/10 backdrop-blur-sm'">
        </div>
        <router-link
          v-if="item.path"
          :to="item.path"
          class="relative z-10 flex items-center justify-center"
          style="display: flex;"
        >
          <img :src="getImageUrl(item.icon)" 
               :alt="item.alt"
               class="h-5 w-5 transition-transform duration-300 group-hover:scale-110">
        </router-link>
        <img
          v-else
          :src="getImageUrl(item.icon)" 
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
  { icon: 'icons8-home-100.png', alt: 'Home', path: '/dashboard/home' },
  { icon: 'icons8-increase-100.png', alt: 'Stats', path: 'bourse' },
  { icon: 'icons8-calendrier-50.png', alt: 'Calendar', path: 'calendar' },
  { icon: 'icons8-météo-pomme-50.png', alt: 'Weather', path: 'weather' },
  { icon: 'icons8-to-do-100.png', alt: 'Todo', path: 'todo' },
  { icon: 'icons8-email-96.png', alt: 'Email', path: 'mail' },
  { icon: 'icons8-settings-100.png', alt: 'Settings' , path:'settings'}
];
</script>

<style scoped>

li > img {
  height: 24 px;
  object-fit: contain;
  cursor:pointer
}

</style>