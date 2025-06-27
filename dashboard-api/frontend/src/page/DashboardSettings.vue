<template>
<div class="settings flex flex-col md:flex-row">
    <nav
    :class="[ isDarkMode ? 'bg-dark-card rounded-lg space-beetween' : 'bg-light-card rounded-lg', 'h-auto md:h-[85vh] w-full md:w-[250px] mb-4 md:mb-0']">
    <h1 class="mx-4 pt-3 pb-3 text-2xl font-thin "
      :class="[ isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">Settings</h1>
      
      <ul class=" flex flex-row md:flex-col gap-2">
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
    <main class="content-settings flex-1 ml-0 md:ml-4">
      <p class="text-2xl font-thin"
      :class="[ isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">Account</p>
      <div class="flex flex-col gap-2">
        <div class="flex flex-col sm:flex-row gap-2 items-center sm:items-start">
            <p class="rounded-full bg-dark-card w-[100px] h-[100px] md:w-[150px] md:h-[150px]"></p>
            <div class="flex flex-col gap-2">
                <p class=" border text-md font-thin mx-auto  px-4 py-1 rounded-2xl"
                :class="[ isDarkMode ? 'border-dark-border text-dark-text-primary bg-dark-card' : 'border-light-border  text-light-text-primary bg-light-card']">Owner</p>
                <p :class="[ isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary', ]"
                >GRIGORIAN Serge</p>
            </div>    
        </div>
        <form @submit.prevent="submitForm" class="w-full">

          <!-- NAME -->

          <div class="flex flex-col md:flex-row gap-4 mt-4 w-full">
            <div class="form-group flex flex-col gap-2 w-full md:w-1/2">
              <label for="name">Name</label>
              <input class="w-full max-w-xs md:max-w-lg" type="name" id="name"
              :class="[
                      isDarkMode 
                        ? 'bg-dark-card  border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
                        : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
                    ]"  >
            </div>

              <!-- EMAIL -->

            <div class="form-group flex flex-col gap-2 w-full md:w-1/2">
              <label for="email">Email</label>
                <input type="email" id="email" 
                class="w-full max-w-xs md:max-w-lg"
                :class="[
                        isDarkMode 
                          ? 'bg-dark-card  border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
                          : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
                      ]"  >
            </div>
          </div>

          <!-- PASSWORD -->
          <div class="form-group flex flex-col gap-4 md:gap-9 mt-4 w-full">
            <label for="password"></label>
            <div class="relative w-full">
              <BulletPoint
                :class="[
                  'absolute top-5 left-2 z-10 w-10 h-10',
                  isDarkMode ? 'bg-dark-card' : 'bg-dark',
                  'border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover'
                ]" 
                :image="'/src/assets/img/icons8-cadenas-60.png'"
                size="20px"/>
              <input 
                class="psw h-[120px] pl-10 w-full max-w-xs md:max-w-lg" 
                type="password" 
                id="password" 
                :class="[
                  isDarkMode 
                    ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover placeholder-white' 
                    : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover placeholder-black'
                ]">
              <span
                class="absolute left-3 bottom-2 text-xl pointer-events-none"
                :class="isDarkMode ? 'text-white' : 'text-black'"
              >
                Change password
              </span>
            </div>
          </div>
          
          <!-- DELETE ACCOUNT  -->
       
          <div class="flex flex-col md:flex-row gap-4 md:gap-8 mt-12 p-4 rounded-xl"
                :class="[
                  isDarkMode 
                        ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover ' 
                        : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover '
                ]">
            <div class="flex flex-col gap-3"
              :class="[
                isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'
              ]">
                <p class="text-3xl">Delete account</p>
                <p>Contact our support team to process deletion of your account</p>
            </div>
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
  border-radius: 0.75rem;
  width: 100%;
  max-width: 450px;
  padding: 6px;
}



</style>