// stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Configuration de l'URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // État initial de l'authentification
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    // Vérifier si l'utilisateur est connecté
    isAuthenticated: (state) => !!state.token && !!state.user,
    
    // Récupérer l'utilisateur actuel
    currentUser: (state) => state.user,
    
    // Vérifier si l'utilisateur a un rôle spécifique
    hasRole: (state) => (role) => {
      return state.user?.roles?.includes(role) || false;
    }
  },

  actions: {
    // Initialisation du store à partir du stockage local
    async init() {
      this.loading = true;
      
      try {
        // Vérifier d'abord le sessionStorage (pour les sessions temporaires)
        let token = sessionStorage.getItem('authToken');
        
        // Si pas trouvé, vérifier le localStorage (pour "Remember me")
        if (!token) {
          token = localStorage.getItem('authToken');
        }
        
        if (token) {
          // Vérifier si le token est valide et non expiré
          const decoded = jwt_decode(token);
          
          if (decoded.exp * 1000 > Date.now()) {
            // Token valide, configurer Axios avec le token
            this.token = token;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Récupérer les infos utilisateur depuis le token
            this.user = {
              id: decoded.sub,
              email: decoded.email,
              name: decoded.name,
              roles: decoded.roles || []
            };
          } else {
            // Token expiré, supprimer les données
            this.logout();
          }
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
        this.logout();
      } finally {
        this.loading = false;
      }
    },
    
    // Connexion utilisateur
    async login({ email, password, rememberMe }) {
      this.loading = true;
      this.error = null;
      
      try {
        // Appel à l'API de connexion
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password
        });
        
        const { token, user } = response.data;
        
        if (token) {
          // Stocker le token selon l'option "Remember me"
          if (rememberMe) {
            localStorage.setItem('authToken', token);
          } else {
            sessionStorage.setItem('authToken', token);
          }
          
          // Configurer Axios pour les futures requêtes
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Mettre à jour l'état
          this.token = token;
          this.user = user;
          
          return { success: true };
        }
        
        return { success: false, message: 'Token non reçu du serveur' };
      } catch (error) {
        console.error('Login error:', error);
        
        // Extraire le message d'erreur de la réponse API
        const message = error.response?.data?.message || 'Échec de la connexion';
        this.error = message;
        
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },
    
    // Déconnexion utilisateur
    logout() {
      // Supprimer le token des stockages
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      
      // Ne pas supprimer l'email mémorisé pour la fonctionnalité "Remember me"
      
      // Supprimer le token de l'en-tête d'autorisation
      delete axios.defaults.headers.common['Authorization'];
      
      // Réinitialiser l'état
      this.token = null;
      this.user = null;
      this.error = null;
    },
    
    // Vérifier si le token est toujours valide
    checkTokenValidity() {
      if (!this.token) return false;
      
      try {
        const decoded = jwt_decode(this.token);
        return decoded.exp * 1000 > Date.now();
      } catch {
        return false;
      }
    },
    
    // Mettre à jour le profil utilisateur
    async updateProfile(userData) {
      if (!this.isAuthenticated) {
        throw new Error('Utilisateur non authentifié');
      }
      
      this.loading = true;
      
      try {
        const response = await axios.put(`${API_URL}/users/profile`, userData);
        this.user = { ...this.user, ...response.data };
        return { success: true, user: this.user };
      } catch (error) {
        console.error('Profile update error:', error);
        this.error = error.response?.data?.message || 'Échec de la mise à jour du profil';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    }
  }
});