<template>
  <div class="p-4">
    <!-- Recherche -->
    <div :class="['mb-6 p-4 rounded-lg', isDarkMode ? 'bg-dark-card' : 'bg-white']">
      <div class="flex gap-4 mb-4">
        <input
          v-model="searchQuery"
          type="text"
          :class="[
            'flex-1 p-2 rounded border',
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          ]"
          placeholder="Rechercher un symbole (ex: AAPL, GOOGL)"
          @keyup.enter="searchSymbols"
        />
        <button
          @click="searchSymbols"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Rechercher
        </button>
      </div>

      <!-- Résultats de recherche -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 transform -translate-y-4"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="searchResults.length > 0" class="mt-4">
          <div :class="['overflow-x-auto rounded-lg', isDarkMode ? 'bg-dark-card' : 'bg-white']">
            <table class="min-w-full">
              <thead :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-100'">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">Symbole</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">Description</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">Action</th>
                </tr>
              </thead>
              <tbody :class="isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'">
                <tr v-for="result in searchResults" :key="result.symbol" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  <td class="px-6 py-4 whitespace-nowrap">{{ result.symbol }}</td>
                  <td class="px-6 py-4">{{ result.description }}</td>
                  <td class="px-6 py-4">
                    <button
                      @click="addToWatchlist(result)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      Suivre
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Transition>
    </div>
    <!-- Convertisseur de devises -->
    <div :class="['mb-6 p-4 rounded-lg', isDarkMode ? 'bg-dark-card' : 'bg-white']">
      <h2 class="text-xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Convertisseur de devises</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            v-model="currencyAmount"
            type="number"
            :class="[
              'w-full p-2 rounded border',
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            ]"
            placeholder="Montant"
          />
        </div>
        <div>
          <select
            v-model="fromCurrency"
            :class="[
              'w-full p-2 rounded border',
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            ]"
          >
            <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
          </select>
        </div>
        <div>
          <select
            v-model="toCurrency"
            :class="[
              'w-full p-2 rounded border',
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            ]"
          >
            <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
          </select>
        </div>
      </div>
      <div class="mt-4 text-center" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
        <p class="text-lg">
          {{ formatAmount(currencyAmount) }} {{ fromCurrency }} = {{ formatAmount(convertedAmount) }} {{ toCurrency }}
        </p>
      </div>
    </div>

    <!-- Liste de suivi avec graphiques -->
    <div :class="['p-4 rounded-lg', isDarkMode ? 'bg-dark-card' : 'bg-white']">
      <h2 class="text-xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Liste de suivi</h2>
      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="(stock, index) in watchlist"
          :key="stock.symbol"
          :class="['p-4 rounded-lg', isDarkMode ? 'bg-gray-800' : 'bg-gray-100']"
          :style="{ animationDelay: `${index * 100}ms` }"
          class="animate-fade-in"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ stock.symbol }}</h3>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">{{ stock.description }}</p>
            </div>
            <button
              @click="removeFromWatchlist(stock.symbol)"
              class="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
          
          <!-- Prix et variation -->
          <div class="mb-4">
            <p :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              Prix: ${{ stock.quote?.c || '...' }}
            </p>
            <p :class="[
              'text-sm',
              stock.quote?.dp > 0 ? 'text-green-500' : stock.quote?.dp < 0 ? 'text-red-500' : 'text-gray-500'
            ]">
              {{ stock.quote?.dp ? `${stock.quote.dp.toFixed(2)}%` : '...' }}
            </p>
          </div>

          <!-- Graphique -->
          <div class="h-64 w-full">
            <canvas :id="'chart-' + stock.symbol"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Actualités du marché -->
    <div :class="['mt-6 p-4 rounded-lg', isDarkMode ? 'bg-dark-card' : 'bg-white']">
      <h2 class="text-xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Actualités du marché</h2>
      <div class="space-y-4">
        <TransitionGroup
          name="news"
          tag="div"
          class="space-y-4"
        >
          <div
            v-for="news in marketNews"
            :key="news.id"
            :class="['p-4 rounded-lg transform transition-all duration-300', isDarkMode ? 'bg-gray-800' : 'bg-gray-100']"
        >
          <h3 class="font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ news.headline }}</h3>
          <p class="text-sm mb-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">{{ news.summary }}</p>
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
    </div>

  
    <div>
      <FinnuhChart symbol="AAPL" :isDarkMode="isDarkMode" />
   
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, Transition } from 'vue';
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

export default {
  name: 'BourseDashboard',
  props: {
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },
  components: {
    FinnuhChart
  },
  setup() {
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

    return {
      searchQuery,
      searchResults,
      watchlist,
      marketNews,
      searchSymbols,
      addToWatchlist,
      removeFromWatchlist,
      currencyAmount,
      fromCurrency,
      toCurrency,
      convertedAmount,
      currencies,
      formatAmount
    };
  }
};
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Transitions pour les nouvelles */
.news-enter-active,
.news-leave-active {
  transition: all 0.5s ease;
}
.news-enter-from,
.news-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.news-move {
  transition: transform 0.5s ease;
}


</style>