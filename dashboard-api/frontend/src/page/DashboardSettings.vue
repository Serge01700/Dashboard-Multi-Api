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
                <p class=" border text-md font-thin mx-auto  px-4 py-1 rounded-2xl"
                :class="[ isDarkMode ? 'border-dark-border text-dark-text-primary bg-dark-card' : 'border-light-border  text-light-text-primary bg-light-card']">Owner</p>
                <p :class="[ isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary', ]"
                >GRIGORIAN Serge</p>
            </div>    
        </div>
        <form @submit.prevent="submitForm">

          <!-- NAME -->

          <div class="flex flex-row gap-4 mt-4">
            <div class="form-group flex flex-col gap-2">
              <label for="name">Name</label>
              <input class="" type="name" id="name"
              :class="[
                      isDarkMode 
                        ? 'bg-dark-card  border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
                        : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
                    ]"  >
            </div>

              <!-- EMAIL -->

            <div class="form-group flex flex-col gap-2">
              <label for="email">Email</label>
              <input type="email" id="email" 
              :class="[
                      isDarkMode 
                        ? 'bg-dark-card  border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
                        : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
                    ]"  >
            </div>
          </div>

          <!-- PASSWORD -->
          <div class="form-group flex flex-col gap-2">
            
              <label for="password">Password</label>
              <BulletPoint
                :class="[
                  'w-9 h-9 mt-1 mr-1',
                  isDarkMode ? 'bg-dark-card' : 'bg-dark',
                  'border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover'
                ]" 
                :image="'/src/assets/img/icons8-cadenas-60.png'"
                size="20px"/>
              <input class="psw h-[200px]" type="password" id="password" 
              :class="[
                      isDarkMode 
                        ? 'bg-dark-card  border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
                        : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
                    ]"  >
                    
            </div>
            




        </form>
      </div>
    </main>
</div>    
  
</template>

<script setup>
import { ref } from 'vue' ;
import BulletPoint from '@/components/BulletPoint.vue';

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


input{
  border: 1px solid var(--color-light-border);
  border-radius: 15px;
  width: 450px;
  padding: 2px;
}

</style>