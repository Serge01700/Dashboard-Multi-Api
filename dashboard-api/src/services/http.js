// services/http.js
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Création d'une instance Axios avec configuration par défaut
const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token JWT à chaque requête
httpClient.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le store
    const authStore = useAuthStore();
    const token = authStore.token;
    
    // Si un token existe, l'ajouter aux headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs 401 (non autorisé)
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();
    
    // Si l'erreur est 401 (non autorisé) et que l'utilisateur est connecté
    if (error.response?.status === 401 && authStore.isAuthenticated) {
      // Déconnecter l'utilisateur
      authStore.logout();
      
      // Rediriger vers la page de connexion
      if (router) {
        router.push({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath }
        });
      }
    }
    
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  // Connecter un utilisateur
  login(credentials) {
    return httpClient.post('/auth/login', credentials);
  },
  
  // Déconnecter un utilisateur
  logout() {
    return httpClient.post('/auth/logout');
  },
  
  // Inscription d'un nouvel utilisateur
  register(userData) {
    return httpClient.post('/auth/register', userData);
  },
  
  // Récupérer le profil de l'utilisateur connecté
  getProfile() {
    return httpClient.get('/users/profile');
  },
  
  // Mettre à jour le profil utilisateur
  updateProfile(userData) {
    return httpClient.put('/users/profile', userData);
  },
  
  // Changer le mot de passe
  changePassword(passwordData) {
    return httpClient.post('/auth/change-password', passwordData);
  }
};

authService.login({ email, password });

// Exporter le client HTTP pour une utilisation dans d'autres services
export default httpClient;