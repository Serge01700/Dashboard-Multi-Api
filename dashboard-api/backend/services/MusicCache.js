import NodeCache from 'node-cache';

// Configuration du cache avec un TTL de 24 heures (86400 secondes)
// et une période de vérification de 48 heures (172800 secondes)
const cache = new NodeCache({
    stdTTL: 86400,
    checkperiod: 172800,
    useClones: false
});

// Wrapper pour les opérations de cache avec gestion des erreurs
export const musicCache = {
    get: (key) => {
        try {
            return cache.get(key);
        } catch (error) {
            console.error('Erreur lors de la récupération du cache musique:', error);
            return null;
        }
    },

    set: (key, value, ttl = 86400) => {
        try {
            return cache.set(key, value, ttl);
        } catch (error) {
            console.error('Erreur lors de la mise en cache des données musicales:', error);
            return false;
        }
    },

    del: (key) => {
        try {
            return cache.del(key);
        } catch (error) {
            console.error('Erreur lors de la suppression du cache musique:', error);
            return false;
        }
    }
};

export default cache; 