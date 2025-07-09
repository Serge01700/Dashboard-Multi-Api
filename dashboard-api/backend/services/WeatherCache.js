import NodeCache from 'node-cache';

// Configuration du cache avec un TTL de 30 minutes (1800 secondes)
// et une période de vérification de 1 heure (3600 secondes)
const cache = new NodeCache({
    stdTTL: 1800,
    checkperiod: 3600,
    useClones: false
});

// Wrapper pour les opérations de cache avec gestion des erreurs
export const weatherCache = {
    get: (key) => {
        try {
            return cache.get(key);
        } catch (error) {
            console.error('Erreur lors de la récupération du cache météo:', error);
            return null;
        }
    },

    set: (key, value, ttl = 1800) => {
        try {
            return cache.set(key, value, ttl);
        } catch (error) {
            console.error('Erreur lors de la mise en cache des données météo:', error);
            return false;
        }
    },

    del: (key) => {
        try {
            return cache.del(key);
        } catch (error) {
            console.error('Erreur lors de la suppression du cache météo:', error);
            return false;
        }
    }
};

export default cache; 