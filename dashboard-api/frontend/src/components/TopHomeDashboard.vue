<template>
    <div class="flex items-start">
        <Transition
              appear
              :style="{ '--delay': `${index * 150}ms` }"
              enter-active-class="transition duration-700 ease-out"
              enter-from-class="opacity-0 -translate-x-20"
              enter-to-class="opacity-100 translate-x-0"
              leave-active-class="transition duration-500 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
                <BulletPoint
                :class="[
                 '  w-[90px] h-[90px] ml-20 md:ml-2',
                isDarkMode ? 'bg-dark-card' : 'bg-dark',
                'border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover'
                ]"
                
            >
                <span class="text-white text-2xl font-light">
                        {{ dayNumber }}
                </span>
        </BulletPoint>
        </Transition>
        
        <!-- JOUR & MOIS  -->

        <Transition
              appear
              :style="{ '--delay': `${index * 150}ms` }"
              enter-active-class="transition duration-700 ease-out"
              enter-from-class="opacity-0 translate-y-20"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-500 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
        
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
        
        </Transition>
        
        
        <Transition
              appear
              :style="{ '--delay': `${index * 150}ms` }"
              enter-active-class="transition duration-700 ease-out"
              enter-from-class="opacity-0 translate-x-20"
              enter-to-class="opacity-100 translate-x-0"
              leave-active-class="transition duration-500 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
               
            <div class="flex ml-7 mt-7">
                <router-link to="todo">
                    <button :class="[
                'px-4 py-2 rounded-3xl transition-all duration-300  text-white cursor-pointer'  ,
               isDarkMode 
                    ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
                    : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover text-light-text-primary' ,
                            
              'hover:shadow-dark-shadow-hover'
            ]">Show my tasks <span>&#8594;</span>
                    </button>
                </router-link>
                
            <!-- CALENDRIER -->
             <router-link to="/dashboard/calendar">
                <BulletPoint 
                    :class="[
                    'ml-4  w-9 cursor-pointer',
                    isDarkMode ? 'bg-dark-card' : 'bg-dark',
                    'border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover'
                    ]"
                    :image="'/src/assets/img/icons8-calendrier-50.png'" 
                    size="20px"
                />
            </router-link>
             
            <!-- <img class="" src="../assets/img/icons8-calendrier-50.png" alt=""> -->
            </div>
            
       
        </Transition>
            
        
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