<template>
  <div class="min-h-screen flex items-center justify-center">
    <form
      class="bg-dark-card flex flex-col gap-4 w-full max-w-md rounded-xl p-6"
      @submit.prevent="handleRegister"
    >
      <h2 class="text-white text-xl text-center">Register</h2>

      <!-- Message d'erreur -->
      <div v-if="errorMessage" class="bg-red-500 text-white p-2 rounded text-sm">
        {{ errorMessage }}
      </div>

      <!-- Nom -->
      <div class="w-full">
        <input
          type="text"
          class="w-full p-2 rounded border bg-gray-100 text-gray-800 placeholder-gray-400"
          v-model="name"
          required
          placeholder="Enter your name..."
          :class="{ 'border-red-500': validationErrors.name }"
        />
        <span v-if="validationErrors.name" class="text-red-500 text-sm">
          {{ validationErrors.name }}
        </span>
      </div>

      <!-- Email -->
      <div class="w-full">
        <input
          type="email"
          class="w-full p-2 rounded border bg-gray-100 text-gray-800 placeholder-gray-400"
          v-model="email"
          required
          placeholder="Enter your email..."
          :class="{ 'border-red-500': validationErrors.email }"
        />
        <span v-if="validationErrors.email" class="text-red-500 text-sm">
          {{ validationErrors.email }}
        </span>
      </div>

      <!-- Mot de passe -->
      <div class="w-full relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          class="w-full p-2 rounded border bg-gray-100 text-gray-800 placeholder-gray-400"
          v-model="password"
          required
          placeholder="Enter your password..."
          :class="{ 'border-red-500': validationErrors.password }"
        />
        <button 
          type="button" 
          class="absolute right-2 top-2 text-gray-500"
          @click="showPassword = !showPassword"
        >
          👁️
        </button>
        <span v-if="validationErrors.password" class="text-red-500 text-sm">
          {{ validationErrors.password }}
        </span>
      </div>

      <button 
        class="w-full bg-dark text-white py-2 rounded flex justify-center items-center" 
        :disabled="isLoading"
      >
        <span v-if="isLoading">Creating account...</span>
        <span v-else>Register</span>
      </button>

      <p class="text-white text-sm text-center">
        Already have an account?
        <RouterLink to="/login" class="text-blue-400 hover:underline">
          Login here
        </RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const validationErrors = ref({})

const handleRegister = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    validationErrors.value = {}

    // Validation
    const { isValid, errors } = authStore.validateRegistrationData({
      email: email.value,
      password: password.value,
      name: name.value
    })

    if (!isValid) {
      validationErrors.value = errors
      return
    }

    // Inscription
    const result = await authStore.register({
      email: email.value.trim(),
      password: password.value,
      name: name.value.trim()
    })

    if (result.success) {
      router.push('/dashboard')
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = 'Une erreur est survenue lors de l\'inscription'
    console.error('Registration error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>