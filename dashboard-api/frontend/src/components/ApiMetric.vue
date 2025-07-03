<template>
    <!-- API STATUS -->
  <div class="api-metric overflow-y-auto relative z-20 w-full max-w-lg p-5 m-8 backdrop-blur-md transition-all duration-300 rounded-3xl border h-[250px] md:h-[210px]"
  :class="[
      isDarkMode 
        ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
        : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
    ]">
    <p class=" mb-4 text-2xl md:text-lg font-light" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">API Status</p>
    <div class="bg-dark-2 rounded-lg p-3 mb-4">
        <!-- ETAT DE L'API -->
        <div class="flex items-center gap-2"> 
            <p class="rounded-full bg-green-500 w-4 h-4"> </p>
            <div class="flex flex-col">
            <p class="text-sm" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Weather API</p>
            <p class="text-[9px] mt-1 tracking-wide" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">All systeme are opperationel </p>
          </div>
          <p class="text-[9px] mt-1 tracking-wide ml-auto" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">Now</p>
        </div>
        
    </div>
    <div class="bg-dark-2 rounded-lg p-3 mb-4">
        <!-- ETAT DE L'API -->
        <div class="flex items-center gap-2"> 
            <p class="rounded-full bg-orange-500 w-4 h-4"> </p>
            <div class="flex flex-col">
            <p class="text-sm" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Email API</p>
            <p class="text-[9px] mt-1 tracking-wide" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">Higher than normal latency</p>
          </div>
          <p class="text-[9px] mt-1 tracking-wide ml-auto" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">15 min</p>
        </div>
        
    </div>
    <div class="bg-dark-2 rounded-lg p-3 mb-4">
        <!-- ETAT DE L'API -->
        <div class="flex items-center gap-2 justify-between"> 
            <p class="rounded-full bg-red-500 w-4 h-4"> </p>
          <div class="flex flex-col">
            <p class="text-sm" :class="isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'">Finance API</p>
            <p class="text-[9px] mt-1 tracking-wide" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">Service disruption detetcted</p>
        </div>
          <p class="text-[9px] mt-1 tracking-wide ml-auto" :class="isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'">5 min</p>
        </div>
        
    </div>


    
  </div>
</template>

<script setup>
const props = defineProps({
    isDarkMode : {
        type : Boolean,
        required : true 
    }
})
</script>

<style>
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