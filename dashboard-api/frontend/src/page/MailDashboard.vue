<template>
  <div class="mail-dashboard rounded-t-[15px]   w-full h-full "
    :class="[
        isDarkMode ? 'bg-dark-card' : 'bg-light-card',
      'border-dark-border '
         ]"
    >
        <h1 class="p-3 text-2xl font-thin border-b-2 border-dark-border p-2"
        :class="[
        isDarkMode ? 'text-dark-text-primary' : 'border-light-border text-light-text-primary'
        ]">Emails</h1>
        <main class=" grid grid-cols-[30%_70%] ">
            <section class=" p-2 left-mail border-r-2 border-dark-border"
              :class="[
                isDarkMode ? '' : 'border-light-border'
              ]">
                <ul class="flex flex-row gap-7 p-2 rounded-sm"
                 :class="[
                  isDarkMode ? 'text-dark-text-primary bg-dark-card' : 'text-light-text-primary bg-light-card'
                 ]">
                    <li
                        :class="[activeTab === 'All Mail' ? 'bg-dark-accent' : '']"
                        @click="activeTab = 'All Mail'"
                    >All Mail</li>
                    <li
                        :class="[activeTab === 'Unread' ? 'bg-dark-accent' : '']"
                        @click="activeTab = 'Unread'"
                    >Unread</li>
                    <li
                        :class="[activeTab === 'Active' ? 'bg-dark-accent' : '']"
                        @click="activeTab = 'Active'"
                    >Archive</li>
                    
                    
                </ul>
            </section>
            <section class="right-mail">
              <div v-if="activeTab === 'All Mail'">
               
              </div>
              <div v-else-if="activeTab === 'Unread'">
               
              </div>
              <div v-else-if="activeTab === 'Active'">
               
              </div>
            </section>
        </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';


const props = defineProps({
    isDarkMode : {
        type: Boolean,
        required: true
    }
})

const activeTab = ref('All Mail');
</script>

<style scoped>
ul > li {
    padding: 0 2px;
    cursor: pointer;
    
}
</style>