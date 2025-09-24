import NodeCache from 'node-cache';

// Configuration du cache avec un TTL de 1 heure (3600 secondes)
// et une période de vérification de 2 heures (7200 secondes)
const cache = new NodeCache({
    stdTTL: 3600,
    checkperiod: 7200,
    useClones: false
});

// Wrapper pour les opérations de cache avec gestion des erreurs
export const exchangeCache = {
    get: (key) => {
        try { return cache.get(key);} 
        catch (error) {
            console.error('Erreur lors de la récupération du cache taux de change:', error);
            return null;
        }
    },
    set: (key, value, ttl = 3600) => {
        try {  return cache.set(key, value, ttl); } catch (error) {
            console.error('Erreur lors de la mise en cache des taux de change:', error);
            return false;
        }
    },

    del: (key) => {
        try { return cache.del(key);} 
        catch (error) {
            console.error('Erreur lors de la suppression du cache taux de change:', error);
            return false;
        }
    }
};

export default cache; 