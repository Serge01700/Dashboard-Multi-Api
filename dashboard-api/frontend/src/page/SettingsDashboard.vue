<template>
<div class="settings flex flex-col md:flex-row">
    <nav
    :class="[ isDarkMode ? 'bg-dark-card rounded-lg space-beetween' : 'bg-light-card rounded-lg', 'h-auto md:h-[85vh] w-full md:w-[250px] mb-4 md:mb-0']">
    <h1 class="mx-4 pt-3 pb-3 text-2xl font-thin "
      :class="[ isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">Settings</h1>
      
      <ul class="flex flex-row md:flex-col gap-2">
        <li class="px-4 py-2"
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
    <main class="content-settings flex-1 px-9  ml-0 md:ml-4">
      <p class="text-2xl font-thin p-4"
      :class="[ isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">Account</p>
      <div class="flex flex-col gap-2">
        <div class="flex flex-col sm:flex-row gap-2 items-center sm:items-center">
          <p class="rounded-full bg-dark-card w-[100px] h-[100px] md:w-[150px] md:h-[150px]"></p>
          <div class="flex flex-col gap-2 ml-7 justify-center">
            <p class="border text-md text-center w-[90px] font-thin text-left rounded-2xl"
            :class="[ isDarkMode ? 'border-dark-border text-dark-text-primary bg-dark-card' : 'border-light-border  text-light-text-primary bg-light-card']">{{ userInfo.roles[0] }}</p>
            <p :class="[ isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary', ]"
            >{{ userInfo.name }}</p>
          </div>    
        </div>
        
        <form @submit.prevent="handleSubmit" class="w-full">
          <div class="flex flex-col md:flex-row gap-4 mt-4 w-full">
            <div class="form-group flex flex-col gap-2 w-full md:w-1/2">
              <label 
              :class="[
                isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'
               ]"
              for="name">Name</label>
              <input 
                class="w-full md:max-w-lg" 
                type="name" 
                id="name"
                v-model="formData.name"
                :class="[
                  isDarkMode 
                    ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
                    : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
                ]">
            </div>

            <div class="form-group flex flex-col gap-2 w-full md:w-1/2">
              <label
               :class="[
                isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'
               ]"
               for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="formData.email"
                  class="w-full md:max-w-lg"
                  :class="[
                    isDarkMode 
                      ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
                      : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover'
                  ]">
            </div>
          </div>

          <div class="form-group flex flex-col gap-4 md:gap-9 mt-4 w-full">
            <label for="password"></label>
            <div class="relative w-full">
              <BulletPoint
                :class="[
                  'absolute top-5 left-2 z-10 w-7 h-7',
                  isDarkMode ? 'bg-dark-card' : 'bg-dark',
                  'border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover', 'cursor-pointer'
                ]" 
                :image="'/src/assets/img/icons8-cadenas-60.png'"
                size="14px"/>
              <input 
                class="psw h-[120px] pl-10 w-full md:max-w-lg" 
                type="password" 
                id="password" 
                v-model="formData.password"
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

          
          <div class="bg-blue-500 flex flex-col md:flex-row gap-4 md:gap-8 mt-12 p-4 rounded-xl cursor-pointer"
            :class="[
              isDarkMode 
                ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover hover:bg-red-900/20' 
                : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover hover:bg-red-100'
               ]"
               @click="handleDeleteAccount">
              <div class="flex flex-col gap-3"
                  :class="[
                  isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'
                 ]">
                  <p class="text-3xl">Delete account</p>
                  <p class="text-xs">Contact our support team to process deletion of your account</p>
              </div>
          </div>


          <button 
            type="submit"
            class="w-full mt-8 px-6 py-2 rounded-lg text-white"
            :class="[
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600'
            ]"
          >
            Save Changes
          </button>
          
        </form>
      </div>
    </main>
</div>    
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BulletPoint from '@/components/BulletPoint.vue';
import { userService } from '@/services/user';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
    isDarkMode: {
        type: Boolean,
        required: true
    }
});

const router = useRouter();
const authStore = useAuthStore();
const activeItem = ref('account');
const userInfo = ref({
    name: '',
    email: '',
    roles: ['user']
});

const formData = ref({
    name: '',
    email: '',
    password: ''
});

const menuItems = [
    { id: 'account', label: 'Account' },
    { id: 'subscription', label: 'Subscription'}
];

function setActiveItem(item) {
    activeItem.value = item;
}

// Charger les informations de l'utilisateur
async function loadUserInfo() {
    try {
        // Vérifier si l'utilisateur est connecté
        if (!authStore.isAuthenticated) {
            console.error('No user logged in');
            router.push('/login');
            return;
        }

        // Récupérer l'utilisateur depuis le store d'authentification
        const currentUser = authStore.currentUser;
        if (!currentUser || !currentUser.id) {
            console.error('Incomplete user information');
            router.push('/login');
            return;
        }

        const userId = currentUser.id;
        const userData = await userService.getUserInfo(userId);
        
        // Mettre à jour les informations utilisateur
        userInfo.value = userData;
        
        // Mettre à jour les champs du formulaire
        formData.value.name = userData.name || '';
        formData.value.email = userData.email || '';
    } catch (error) {
        console.error('Error loading user information:', error);
        if (error.response?.status === 401) {
            router.push('/login');
        }
    }
}

// Gérer la soumission du formulaire
async function handleSubmit() {
    try {
        const currentUser = authStore.currentUser;
        if (!currentUser) {
            throw new Error('No user logged in');
        }

        const userId = currentUser.id;
        const updateData = {
            name: formData.value.name,
            email: formData.value.email
        };
        
        if (formData.value.password) {
            updateData.password = formData.value.password;
        }

        const updatedUser = await userService.updateUser(userId, updateData);
        
        // Mettre à jour les informations locales
        userInfo.value = { ...userInfo.value, ...updatedUser };
        formData.value.password = ''; // Réinitialiser le champ mot de passe
        
        // Mettre à jour le store d'authentification
        authStore.user = { ...authStore.user, ...updateData };
        
        alert('Changes saved successfully!');
    } catch (error) {
        console.error('Error during update:', error);
        alert('Error during update: ' + (error.message || 'Unknown error'));
    }
}

// Gérer la suppression du compte
async function handleDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action is irreversible.')) {
        try {
            const userId = authStore.user.id;
            await userService.deleteUser(userId);
            authStore.logout(); // Déconnexion après la suppression
            router.push('/login'); // Redirection vers la page de connexion
        } catch (error) {
            console.error('Erreur lors de la suppression du compte:', error);
            
        }
    }
}

onMounted(() => {
    loadUserInfo();
});
</script>

<style>
* {
    margin: 0;
    padding: 0;
}

input {
    border: 1px solid var(--color-light-border);
    border-radius: 0.75rem;
    width: 100%;
    padding: 6px;
}
</style>