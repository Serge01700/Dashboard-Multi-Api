<template>
    <div class="flex items-start">
        <BulletPoint
            :class="[
            'w-[100px] h-[100px] ml-20',
            isDarkMode ? 'bg-dark-card' : 'bg-dark',
            'border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover'
            ]"
            
        >
            <span class="text-white text-4xl font-light">
                {{ dayNumber }}
            </span>
        </BulletPoint>
        <div class="text-xl flex flex-col ml-4 mt-4">
            <p class="day"
                :class="isDarkMode ? 'text-white' : 'text-gray-800'"
            >
                {{ dayLetter }},
            </p>
            <p class="month"
                :class="isDarkMode ? 'text-white' : 'text-gray-800'"
            >
                {{ month }}
            </p>
        </div>
            <div class="flex ml-7 mt-7">
                <router-link to="todo">
                    <button :class="[
                'px-4 py-2 rounded-3xl transition-all duration-300  text-white cursor-pointer'  ,
               isDarkMode 
                    ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
                    : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover text-dark' ,
                            
              'hover:shadow-dark-shadow-hover'
            ]">Show my tasks <span>&#8594;</span>
                    </button>
                </router-link>
                
            <!-- CALENDRIER -->
             <BulletPoint 
            :class="[
              'ml-4  w-9 cursor-pointer',
              isDarkMode ? 'bg-dark-card' : 'bg-dark',
              'border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover'
            ]"
            :image="'/src/assets/img/icons8-calendrier-50.png'" 
            size="20px"
          />
            <!-- <img class="" src="../assets/img/icons8-calendrier-50.png" alt=""> -->
            </div>
            
        
    </div>
</template>

<script setup>
import BulletPoint from './BulletPoint.vue';
import { computed } from 'vue';

const props = defineProps({
  isDarkMode: Boolean
});

const dayLetter = computed(() => 
   new Date().toLocaleDateString('en-EN', { weekday: 'long' }));

const dayNumber = computed(() => new Date().getDate());

const month = computed(() => new Date().toLocaleDateString('en-EN', { month: 'long' }));
</script>



<style>
</style>