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
        <button :class="[
            'px-4 py-2 rounded-lg transition-all duration-300 text-white'  ,
            isDarkMode ? 'bg-dark-card' : 'bg-dark' ,
            
            'border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover'
        ]">Show my tasks <span>&#8594</span></button>
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