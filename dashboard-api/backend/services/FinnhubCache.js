import NodeCache from 'node-cache';

// Configuration du cache avec un TTL de 5 minutes (300 secondes)
// et une période de vérification de 10 minutes (600 secondes)
const cache = new NodeCache({
    stdTTL: 300,
    checkperiod: 600,
    useClones: false
});

// Wrapper pour les opérations de cache avec gestion des erreurs
export const finnhubCache = {
    get: (key) => {
        try {
            return cache.get(key);
        } catch (error) {
            console.error('Erreur lors de la récupération du cache bourse:', error);
            return null;
        }
    },

    set: (key, value, ttl = 300) => {
        try {
            return cache.set(key, value, ttl);
        } catch (error) {
            console.error('Erreur lors de la mise en cache des données boursières:', error);
            return false;
        }
    },

    del: (key) => {
        try {
            return cache.del(key);
        } catch (error) {
            console.error('Erreur lors de la suppression du cache bourse:', error);
            return false;
        }
    }
};

export default cache; 