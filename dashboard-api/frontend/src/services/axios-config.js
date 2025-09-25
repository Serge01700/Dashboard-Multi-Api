import axios from 'axios';
import router from '@/router';

// Récupérer l'URL de l'API
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Créer une instance Axios avec une configuration de base
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true
});

// Intercepteur pour les requêtes
apiClient.interceptors.request.use(
  config => {
    // Récupérer le token depuis le stockage
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    
    // Si le token existe, l'ajouter aux en-têtes
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    // Gérer les erreurs de requête
    console.error('Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
apiClient.interceptors.response.use(
  response => {
    // Traiter les réponses réussies
    return response;
  },
  error => {
    // Gérer les erreurs de réponse
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error('Erreur API:', error.response.status, error.response.data);
      
      // Si le token est invalide ou expiré (401, 403)
      if (error.response.status === 401) {
        // Si c'est une erreur d'authentification Gmail, rediriger vers l'URL d'auth Gmail
        if (error.response.data.authUrl) {
          window.location.href = `${API_URL}${error.response.data.authUrl}`;
          return;
        }
        // Sinon, supprimer le token et rediriger vers la page de connexion
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        router.push('/login');
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Erreur de réseau:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;