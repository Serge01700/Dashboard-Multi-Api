<template>
  <div class="min-h-screen flex items-center justify-center ">
    <form
      class="bg-dark-card flex flex-col gap-4 w-full max-w-md rounded-xl p-6"
      @submit.prevent="handleLogin"
    >
      <h2 class="text-white text-xl text-center">Login</h2>

      <!-- Message d'erreur -->
      <div v-if="errorMessage" class="bg-red-500 text-white p-2 rounded text-sm">
        {{ errorMessage }}
      </div>

      <!-- Email -->
      <div class="w-full text-black">
        <input
          type="email"
          class="w-full p-2 rounded border"
          v-model="email"
          required
          placeholder="Enter your email..."
          autocomplete="email"
        />
      </div>

      <!-- Mot de passe -->
      <div class="w-full relative text-black">
        <input
          :type="showPassword ? 'text' : 'password'"
          class="w-full p-2 rounded border"
          v-model="password"
          required
          placeholder="Enter your password..."
          autocomplete="current-password"
        />
        <button 
          type="button" 
          class="absolute right-2 top-2 text-gray-500"
          @click="showPassword = !showPassword"
        >
          👁️
        </button>
      </div>

      <div class="flex items-center gap-2 text-white text-sm checkbox">
        <input type="checkbox" v-model="rememberMe" id="remember"> <label for="remember">Remember me</label>
      </div>
      
      <button 
        class="w-full bg-dark text-white py-2 rounded flex justify-center items-center" 
        :disabled="isLoading"
      >
        <span v-if="isLoading">Chargement...</span>
        <span v-else>Se connecter</span>
      </button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    const showPassword = ref(false);
    const errorMessage = ref('');
    const isLoading = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();

    // Restaurer l'email si "Remember me" était activé précédemment
    onMounted(() => {
      const savedEmail = localStorage.getItem('rememberedEmail');
      if (savedEmail) {
        email.value = savedEmail;
        rememberMe.value = true;
      }
    });

    // Fonction de connexion
    const handleLogin = async () => {
      try {
        // Réinitialiser les messages d'erreur
        errorMessage.value = '';
        isLoading.value = true;

        // Validation côté client 
        if (!email.value || !password.value) {
          errorMessage.value = 'Veuillez remplir tous les champs';
          isLoading.value = false;
          return;
        }

        // Vérification des tentatives de connexion échouées
        const loginAttempts = parseInt(sessionStorage.getItem('loginAttempts') || '0');
        if (loginAttempts >= 5) {
          const lastAttempt = parseInt(sessionStorage.getItem('lastLoginAttempt') || '0');
          const currentTime = Date.now();
          
          // Attente de 15 minutes (900000 ms) après 5 tentatives échouées
          if (currentTime - lastAttempt < 900000) {
            errorMessage.value = 'Trop de tentatives. Veuillez réessayer plus tard.';
            isLoading.value = false;
            return;
          } else {
            // Réinitialiser les tentatives après le délai d'attente
            sessionStorage.setItem('loginAttempts', '0');
          }
        }

        // Appel à l'action de login du store Pinia
        const result = await authStore.login({
          email: email.value.trim(),
          password: password.value,
          rememberMe: rememberMe.value
        });

        // Si la connexion est réussie, rediriger vers la page d'accueil
        if (result.success) {
          // Stocker l'email si "Remember me" est activé
          if (rememberMe.value) {
            localStorage.setItem('rememberedEmail', email.value);
          } else {
            localStorage.removeItem('rememberedEmail');
          }

          // Réinitialiser les tentatives de connexion
          sessionStorage.removeItem('loginAttempts');
          sessionStorage.removeItem('lastLoginAttempt');

          // Rediriger vers la page protégée ou la page d'accueil
          const redirectPath = router.currentRoute.value.query.redirect || '/dashboard';
          router.push(redirectPath);
        } else {
          // En cas d'échec, augmenter le compteur de tentatives
          sessionStorage.setItem('loginAttempts', (loginAttempts + 1).toString());
          sessionStorage.setItem('lastLoginAttempt', Date.now().toString());
          errorMessage.value = result.message || 'Échec de la connexion';
        }
      } catch (error) {
        errorMessage.value = 'Une erreur est survenue lors de la connexion';
        console.error('Login error:', error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      rememberMe,
      showPassword,
      errorMessage,
      isLoading,
      handleLogin
    };
  }
}
</script>

<style scoped>


button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>