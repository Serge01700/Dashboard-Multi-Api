import axios from 'axios';

const ITUNES_API_BASE_URL = 'https://itunes.apple.com';

// Artistes populaires par genre pour avoir des résultats garantis
const POPULAR_ARTISTS = {
  pop: 'Taylor Swift',
  rock: 'Imagine Dragons',
  jazz: 'Miles Davis',
  classical: 'Mozart'
};

export const musicService = {
  async fetchMusicByGenre(genre) {
    try {
      // Si c'est un genre connu, utiliser l'artiste populaire, sinon utiliser le terme directement
      const searchTerm = POPULAR_ARTISTS[genre] || genre;
      
      const response = await axios.get(`${ITUNES_API_BASE_URL}/search`, {
        params: {
          term: searchTerm,
          media: 'music',
          entity: 'song',
          limit: 12, // Augmenter la limite pour avoir plus de résultats
          country: 'FR'
        }
      });

      if (!response.data || !response.data.results) {
        throw new Error('Format de réponse invalide de l\'API iTunes');
      }

      // Filtrer pour ne garder que les chansons avec une prévisualisation
      const results = response.data.results.filter(track => track.previewUrl);

      if (results.length === 0) {
        throw new Error(`Aucun résultat trouvé pour "${searchTerm}"`);
      }

      return results;
    } catch (error) {
      console.error('Erreur iTunes:', error);
      if (error.response) {
        // Si c'est une erreur 404, donner un message plus convivial
        if (error.response.status === 404) {
          throw new Error(`Aucun résultat trouvé pour "${genre}"`);
        }
        throw new Error(`Erreur API iTunes (${error.response.status}): ${error.response.data?.errorMessage || 'Erreur inconnue'}`);
      } else if (error.request) {
        throw new Error('Impossible de contacter l\'API iTunes. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  },

  async fetchMultipleGenres(genres) {
    try {
      const results = await Promise.allSettled(genres.map(genre => this.fetchMusicByGenre(genre)));
      
      // Traiter les résultats individuellement
      const processedResults = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.error(`Erreur pour le genre ${genres[index]}:`, result.reason);
          return []; // Retourner un tableau vide en cas d'échec
        }
      });

      // Si tous les appels ont échoué, lever une erreur
      if (processedResults.every(result => result.length === 0)) {
        throw new Error('Impossible de charger la musique pour tous les genres');
      }

      return processedResults;
    } catch (error) {
      throw new Error(`Erreur lors du chargement des genres musicaux: ${error.message}`);
    }
  }
}; 