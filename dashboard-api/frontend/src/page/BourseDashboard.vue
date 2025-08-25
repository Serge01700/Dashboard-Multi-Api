<template>
  <div class="p-6">
    <!-- Barre de recherche -->
    <Transition
      appear
      enter-active-class="transition duration-700 ease-out"
      enter-from-class="opacity-0 translate-y-20"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div class="mb-6">
        <div class="flex gap-4">
          <input
            type="text"
            v-model="searchQuery"
            @input="searchSymbols"
            placeholder="Rechercher une action..."
            class="flex-1 p-2 rounded-lg border"
            :class="[
              isDarkMode 
                ? 'bg-dark-card border-dark-border text-white' 
                : 'bg-white border-gray-300'
            ]"
          />
        </div>

        <!-- Résultats de recherche -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="searchResults.length > 0" 
            class="mt-2 p-2 rounded-lg border"
            :class="[isDarkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-300']"
          >
            <div
              v-for="result in searchResults"
              :key="result.symbol"
              @click="addToWatchlist(result)"
              class="p-2 cursor-pointer hover:bg-gray-100 rounded"
              :class="[isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100']"
            >
              <div class="font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                {{ result.symbol }}
              </div>
              <div class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
                {{ result.description }}
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Liste de suivi -->
    <TransitionGroup
      appear
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 translate-x-20"
      enter-to-class="opacity-100 translate-x-0"
      move-class="transition duration-500"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
    >
      <div
        v-for="stock in watchlist"
        :key="stock.symbol"
        :class="['p-4 rounded-lg', isDarkMode ? 'bg-dark-card' : 'bg-white']"
      >
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="text-lg font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              {{ stock.symbol }}
            </h3>
            <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
              {{ stock.description }}
            </p>
          </div>
          <button
            @click="removeFromWatchlist(stock.symbol)"
            class="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
        <div class="mt-4">
          <p :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            Prix actuel: ${{ stock.quote?.c || 'N/A' }}
          </p>
          <p :class="[
            stock.quote?.dp > 0 ? 'text-green-500' : 'text-red-500'
          ]">
            {{ stock.quote?.dp > 0 ? '+' : '' }}{{ stock.quote?.dp || 0 }}%
          </p>
        </div>
      </div>
    </TransitionGroup>

    <!-- Convertisseur de devises -->
    <Transition
      appear
      enter-active-class="transition duration-700 ease-out"
      enter-from-class="opacity-0 translate-y-20"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div :class="['p-4 rounded-lg mb-6', isDarkMode ? 'bg-dark-card' : 'bg-white']">
        <h2 class="text-xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
          Convertisseur de devises
        </h2>
        <div class="flex flex-wrap gap-4">
          <input
            type="number"
            v-model="currencyAmount"
            class="w-32 p-2 rounded border"
            :class="[isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300']"
          />
          <select
            v-model="fromCurrency"
            class="p-2 rounded border"
            :class="[isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300']"
          >
            <option v-for="currency in currencies" :key="currency" :value="currency">
              {{ currency }}
            </option>
          </select>
          <span :class="isDarkMode ? 'text-white' : 'text-gray-900'">To</span>
          <select
            v-model="toCurrency"
            class="p-2 rounded border"
            :class="[isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300']"
          >
            <option v-for="currency in currencies" :key="currency" :value="currency">
              {{ currency }}
            </option>
          </select>
          <p class="text-lg" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            = {{ formatAmount(convertedAmount) }}
          </p>
        </div>
      </div>
    </Transition>

    <!-- Actualités du marché -->
    <Transition
      appear
      enter-active-class="transition duration-700 ease-out"
      enter-from-class="opacity-0 translate-y-20"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div :class="['mt-6 p-4 rounded-lg', isDarkMode ? 'bg-dark-card' : 'bg-white']">
        <h2 class="text-xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
          Actualités du marché
        </h2>
        <TransitionGroup
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          move-class="transition duration-500"
          class="space-y-4"
        >
          <div
            v-for="news in marketNews"
            :key="news.id"
            :class="['p-4 rounded-lg', isDarkMode ? 'bg-gray-800' : 'bg-gray-100']"
          >
            <h3 class="font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              {{ news.headline }}
            </h3>
            <p class="text-sm mb-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
              {{ news.summary }}
            </p>
            <a
              :href="news.url"
              target="_blank"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              Lire plus
            </a>
          </div>
        </TransitionGroup>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, Transition, TransitionGroup } from 'vue';
import { finnhubService } from '../services/finnhub';
import { Chart } from 'chart.js';
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import FinnuhChart from '@/components/FinnuhChart.vue';

// Enregistrer les composants nécessaires de Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const searchQuery = ref('');
const searchResults = ref([]);
const watchlist = ref([]);
const marketNews = ref([]);
const charts = ref({});

// Variables pour le convertisseur de devises
const currencyAmount = ref(1);
const fromCurrency = ref('USD');
const toCurrency = ref('EUR');
const convertedAmount = ref(0);
const currencies = ref(['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY']);

const searchSymbols = async () => {
  if (!searchQuery.value) return;
  try {
    const results = await finnhubService.searchSymbol(searchQuery.value);
    searchResults.value = results;
  } catch (error) {
    console.error('Erreur de recherche:', error);
  }
};

const addToWatchlist = async (stock) => {
  if (watchlist.value.some(item => item.symbol === stock.symbol)) return;
  
  try {
    const quote = await finnhubService.getQuote(stock.symbol);
    const newStock = {
      ...stock,
      quote
    };
    watchlist.value.push(newStock);
    localStorage.setItem('watchlist', JSON.stringify(watchlist.value));
    
    // Charger les données historiques et créer le graphique
    await createFinnuhChart(newStock);
  } catch (error) {
    console.error('Erreur lors de l\'ajout à la liste de suivi:', error);
  }
};

const removeFromWatchlist = (symbol) => {
  // Détruire le graphique existant
  if (charts.value[symbol]) {
    charts.value[symbol].destroy();
    delete charts.value[symbol];
  }
  
  watchlist.value = watchlist.value.filter(stock => stock.symbol !== symbol);
  localStorage.setItem('watchlist', JSON.stringify(watchlist.value));
};

const createFinnuhChart = async (stock) => {
  try {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 1);

    const candleData = await finnhubService.getCandles(stock.symbol, 'D', from, to);
    
    if (candleData.s !== 'ok') {
      console.error('Données non disponibles pour', stock.symbol);
      return;
    }

    const ctx = document.getElementById('chart-' + stock.symbol);
    if (!ctx) return;

    // Détruire le graphique existant si présent
    if (charts.value[stock.symbol]) {
      charts.value[stock.symbol].destroy();
    }

    charts.value[stock.symbol] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: candleData.t.map(timestamp => new Date(timestamp * 1000).toLocaleDateString()),
        datasets: [{
          label: stock.symbol,
          data: candleData.c,
          borderColor: '#3b82f6',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            ticks: {
              color: isDarkMode ? '#fff' : '#000'
            }
          },
          x: {
            ticks: {
              color: isDarkMode ? '#fff' : '#000'
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du graphique:', error);
  }
};

const updateQuotes = async () => {
  for (const stock of watchlist.value) {
    try {
      const quote = await finnhubService.getQuote(stock.symbol);
      stock.quote = quote;
      await createFinnuhChart(stock);
    } catch (error) {
      console.error(`Erreur de mise à jour pour ${stock.symbol}:`, error);
    }
  }
};

const loadMarketNews = async () => {
  try {
    const news = await finnhubService.getMarketNews();
    marketNews.value = news.slice(0, 5);
  } catch (error) {
    console.error('Erreur lors du chargement des nouvelles:', error);
  }
};

const updateConversion = async () => {
  if (currencyAmount.value && fromCurrency.value && toCurrency.value) {
    try {
      const result = await finnhubService.convertCurrency(
        currencyAmount.value,
        fromCurrency.value,
        toCurrency.value
      );
      convertedAmount.value = result;
    } catch (error) {
      console.error('Erreur de conversion:', error);
    }
  }
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
};

// Surveiller les changements des valeurs de conversion
watch([currencyAmount, fromCurrency, toCurrency], updateConversion);

onMounted(async () => {
  const savedWatchlist = localStorage.getItem('watchlist');
  if (savedWatchlist) {
    watchlist.value = JSON.parse(savedWatchlist);
    await updateQuotes();
    
    // Créer les graphiques pour chaque action
    for (const stock of watchlist.value) {
      await createFinnuhChart(stock);
    }
  }

  await loadMarketNews();
  await updateConversion();

  // Mettre à jour les cours toutes les 10 secondes
  setInterval(updateQuotes, 10000);
});

defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
}

/* Transitions pour les éléments de la watchlist */
.watchlist-enter-active,
.watchlist-leave-active {
  transition: all 0.5s ease;
}

.watchlist-enter-from,
.watchlist-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.watchlist-move {
  transition: transform 0.5s ease;
}

/* Transitions pour les actualités */
.news-enter-active,
.news-leave-active {
  transition: all 0.5s ease;
}

.news-enter-from,
.news-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.news-move {
  transition: transform 0.5s ease;
}
</style>