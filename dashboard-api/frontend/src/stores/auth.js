import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import apiClient from '@/services/axios-config';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user,
    hasRole: (state) => (role) => {
      return state.user?.roles?.includes(role) || false;
    }
  },

  actions: {
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
          const decoded = jwtDecode(token); // Correction: utilisation de jwtDecode au lieu de jwt_decode
          
          if (decoded.exp * 1000 > Date.now()) {
            // Token valide
            this.token = token;
            
            // Récupérer les infos utilisateur depuis le token
            this.user = {
              id: decoded.sub,
              email: decoded.email,
              name: decoded.name,
              roles: decoded.roles || []
            };
            
            // Vérifier si l'utilisateur existe toujours sur le serveur 
            try {
              const response = await apiClient.get('/users/profile');
              // Mettre à jour les informations utilisateur si nécessaire
              this.user = response.data;
            } catch (profileError) {
              console.warn('Impossible de récupérer le profil, utilisation des données du token');
            }
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
    
    async login({ email, password, rememberMe }) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('Tentative de connexion pour:', email);
        
        // Appel à l'API de connexion
        const response = await apiClient.post('/auth/login', {
          email,
          password
        });
        
        const { token, user } = response.data;
        
        if (token) {
          console.log('Connexion réussie');
          
          // Stocker le token selon l'option "Remember me"
          if (rememberMe) {
            localStorage.setItem('authToken', token);
          } else {
            sessionStorage.setItem('authToken', token);
          }
          
          // Mettre à jour l'état
          this.token = token;
          this.user = user;
          
          return { success: true, redirectTo: '/dashboard/home' };
        }
        
        return { success: false, message: 'Token non reçu du serveur' };
      } catch (error) {
        console.error('Login error:', error);
        
        // Extraire le message d'erreur de la réponse API
        let message = 'Échec de la connexion';
        
        if (!error.response) {
          message = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
        } else if (error.response.status === 401) {
          message = 'Email ou mot de passe incorrect';
        } else if (error.response?.data?.message) {
          message = error.response.data.message;
        }
        
        this.error = message;
        
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },

    async register({ email, password, name }) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('Tentative d\'inscription pour:', email);
        
        // Appel à l'API d'inscription
        const response = await apiClient.post('/auth/register', {
          email,
          password,
          name
        });
        
        const { token, user } = response.data;
        
        if (token) {
          console.log('Inscription réussie');
          
          // Stocker le token dans le sessionStorage
          sessionStorage.setItem('authToken', token);
          
          // Mettre à jour l'état
          this.token = token;
          this.user = user;
          
          return { success: true, user };
        }
        
        return { 
          success: false, 
          message: 'Erreur lors de l\'inscription' 
        };
      } catch (error) {
        console.error('Register error:', error);
        
        // Gestion des erreurs spécifiques
        let message = 'Erreur lors de l\'inscription';
        
        if (!error.response) {
          message = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
        } else if (error.response?.status === 409) {
          message = 'Cet email est déjà utilisé';
        } else if (error.response?.data?.message) {
          message = error.response.data.message;
        }
        
        this.error = message;
        return { success: false, message };
      } finally {
        this.loading = false;
      }
    },
  
    // Le reste du code reste inchangé
    validateRegistrationData({ email, password, name }) {
      const errors = {};
      
      // Validation de l'email
      if (!email || !email.includes('@')) {
        errors.email = 'Email invalide';
      }
      
      // Validation du mot de passe
      if (!password || password.length < 8) {
        errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      }
      
      // Validation du nom
      if (!name || name.trim().length < 2) {
        errors.name = 'Le nom doit contenir au moins 2 caractères';
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    },

    logout() {
      // Supprimer le token des stockages
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      
      // Réinitialiser l'état
      this.token = null;
      this.user = null;
      this.error = null;
      
      console.log('Déconnexion effectuée');
    },
    
    checkTokenValidity() {
      if (!this.token) return false;
      
      try {
        const decoded = jwtDecode(this.token);
        return decoded.exp * 1000 > Date.now();
      } catch {
        return false;
      }
    },
    
    async updateProfile(userData) {
      if (!this.isAuthenticated) {
        throw new Error('Utilisateur non authentifié');
      }
      
      this.loading = true;
      
      try {
        const response = await apiClient.put('/users/profile', userData);
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