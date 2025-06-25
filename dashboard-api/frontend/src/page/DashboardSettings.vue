<template>
<div class="settings flex">
    <nav
    :class="[ isDarkMode ? 'bg-dark-card rounded-lg space-beetween' : 'bg-light-card rounded-lg', 'h-[85vh] w-[250px]']">
    <h1 class="mx-4 pt-3 pb-3 text-2xl font-thin "
      :class="[ isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">Settings</h1>
      
      <ul class=" flex flex-col gap-2">
        <li
         v-for="item in menuItems"
         :key="item.id"
         :class="[
           activeItem === item.id
             ? 'bg-active text-white'
             : isDarkMode
               ? 'text-dark-text-primary'
               : 'text-light-text-black',
           'cursor-pointer p-1',
         ]"
         @click="setActiveItem(item.id)">
         {{ item.label }}
        </li>
        
      </ul>
    </nav>
    <main class="content-settings flex-1 ml-4">
      <p class="text-2xl font-thin"
      :class="[ isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">Account</p>
      <div class="flex flex-col gap-2">
        <div class="flex flex-row gap-2">
            <p class=" rounded-full bg-dark-card w-[150px] h-[150px]"></p>
            <div class="flex flex-col gap-2">
                <p class="text-md font-thin mx-auto p-2 rounded-xl"
                :class="[ isDarkMode ? 'text-dark-text-primary bg-dark-card' : 'text-light-text-primary bg-light-card']">Owner</p>
                <p :class="[ isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']"
                >GRIGORIAN Serge</p>
            </div>
                
        </div>
      </div>
    </main>
</div>    
  
</template>

<script setup>
import { ref } from 'vue' ;

const props = defineProps({
    isDarkMode : {
        type: Boolean,
        required: true
    }
})

const activeItem = ref('account');

const menuItems = [
    { id: 'account', label: 'Account' },
    { id: 'subscription', label: 'Subscription'}
]

function setActiveItem(item) {
    activeItem.value = item;
}

</script>

<style>
* {
    margin: 0;
    padding: 0;
}


</style>