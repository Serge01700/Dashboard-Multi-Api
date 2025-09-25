import axios from 'axios';
import apiClient from './axios-config';

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || 'd1j4jg1r01qhbuvtf9jgd1j4jg1r01qhbuvtf9k0';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Créer une instance axios spécifique pour Finnhub
const finnhubClient = axios.create({
    baseURL: FINNHUB_BASE_URL,
    timeout: 10000,
    withCredentials: false
});

// Instance pour l'API de conversion de devises
const exchangeClient = axios.create({
    baseURL: 'https://api.exchangerate-api.com/v4',
    timeout: 10000,
    withCredentials: false
});

export const finnhubService = {
    // Obtenir le prix en temps réel d'un symbole
    getQuote: async (symbol) => {
        try {
            const response = await finnhubClient.get('/quote', {
                params: {
                    symbol: symbol,
                    token: FINNHUB_API_KEY
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération du cours:', error);
            throw error;
        }
    },

    // Rechercher des symboles
    searchSymbol: async (query) => {
        try {
            const response = await finnhubClient.get('/search', {
                params: {
                    q: query,
                    token: FINNHUB_API_KEY
                }
            });
            return response.data.result;
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            throw error;
        }
    },

    // Obtenir les nouvelles du marché
    getMarketNews: async () => {
        try {
            const response = await finnhubClient.get('/news', {
                params: {
                    category: 'general',
                    token: FINNHUB_API_KEY
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des nouvelles:', error);
            throw error;
        }
    },

    // Obtenir les données historiques pour les graphiques
    getCandles: async (symbol, resolution = 'D', from, to) => {
        try {
            const response = await finnhubClient.get('/stock/candle', {
                params: {
                    symbol,
                    resolution,
                    from: Math.floor(from.getTime() / 1000),
                    to: Math.floor(to.getTime() / 1000),
                    token: FINNHUB_API_KEY
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données historiques:', error);
            throw error;
        }
    },

    // Obtenir les taux de change via le backend pour bénéficier du cache et éviter les CORS/CSP
    getExchangeRates: async (baseCurrency = 'USD') => {
        try {
            // Use the configured apiClient (has baseURL '/api') so we call '/api/exchange/...'
            const response = await apiClient.get(`/exchange/latest/${baseCurrency}`);
            return response.data.rates;
        } catch (error) {
            console.error('Erreur lors de la récupération des taux de change via backend:', error);
            throw error;
        }
    },

    // Convertir un montant entre deux devises
    convertCurrency: async (amount, fromCurrency, toCurrency) => {
        try {
            const rates = await finnhubService.getExchangeRates(fromCurrency);
            const rate = rates ? rates[toCurrency] : undefined;
            if (rate === undefined || rate === null || Number.isNaN(Number(rate))) {
                throw new Error(`Taux introuvable pour ${toCurrency} à partir de ${fromCurrency}`);
            }
            return amount * Number(rate);
        } catch (error) {
            console.error('Erreur lors de la conversion:', error);
            throw error;
        }
    }
}