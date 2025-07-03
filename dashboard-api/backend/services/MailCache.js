import NodeCache from 'node-cache';

// Configuration du cache
// stdTTL: temps de vie par défaut en secondes (ici 5 minutes)
// checkperiod: période de vérification pour le nettoyage automatique (ici 10 minutes)
const cache = new NodeCache({
    stdTTL: 300,
    checkperiod: 600,
    useClones: false
});

// Wrapper pour get/set avec gestion des erreurs
export const cacheWrapper = {
    get: (key) => {
        try {
            return cache.get(key);
        } catch (error) {
            console.error('Erreur lors de la récupération du cache:', error);
            return null;
        }
    },

    set: (key, value, ttl = 300) => {
        try {
            return cache.set(key, value, ttl);
        } catch (error) {
            console.error('Erreur lors de la mise en cache:', error);
            return false;
        }
    },

    del: (key) => {
        try {
            return cache.del(key);
        } catch (error) {
            console.error('Erreur lors de la suppression du cache:', error);
            return false;
        }
    }
};

// Gestionnaire de quotas
class QuotaManager {
    constructor() {
        this.quotaCache = new NodeCache({ stdTTL: 86400 }); // 24 heures
        this.DEFAULT_DAILY_QUOTA = 1000000; // Quota par défaut
        this.QUOTA_WARNING_THRESHOLD = 0.8; // Alerte à 80% du quota
    }

    // Initialiser ou mettre à jour le quota
    initQuota(userId, quota = this.DEFAULT_DAILY_QUOTA) {
        const today = new Date().toISOString().split('T')[0];
        const key = `${userId}_${today}`;
        
        if (!this.quotaCache.get(key)) {
            this.quotaCache.set(key, {
                remaining: quota,
                total: quota,
                lastUpdated: new Date().toISOString()
            });
        }
    }

    // Vérifier et mettre à jour le quota
    checkQuota(userId, cost = 1) {
        const today = new Date().toISOString().split('T')[0];
        const key = `${userId}_${today}`;
        const quota = this.quotaCache.get(key);

        if (!quota) {
            this.initQuota(userId);
            return this.checkQuota(userId, cost);
        }

        if (quota.remaining < cost) {
            throw new Error('Quota dépassé pour aujourd\'hui');
        }

        // Mettre à jour le quota restant
        quota.remaining -= cost;
        this.quotaCache.set(key, quota);

        // Vérifier si on approche de la limite
        if (quota.remaining / quota.total <= this.QUOTA_WARNING_THRESHOLD) {
            console.warn(`Attention: ${userId} approche de sa limite de quota (${quota.remaining}/${quota.total})`);
        }

        return true;
    }

    // Obtenir l'état actuel du quota
    getQuotaStatus(userId) {
        const today = new Date().toISOString().split('T')[0];
        const key = `${userId}_${today}`;
        return this.quotaCache.get(key) || null;
    }
}

export const quotaManager = new QuotaManager();

export default cache; 