<template>
  <div class="min-h-screen p-6" :class="[isDarkMode ? 'bg-gray-900' : 'bg-gray-50']">
    <!-- Header professionnel -->
    <Transition
      appear
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
              Portfolio Manager
            </h1>
            <p class="text-sm mt-1" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
              Surveillez vos investissements en temps réel
            </p>
          </div>
          
          <!-- Bouton d'ajout d'action -->
          <button
            @click="toggleSearchBar"
            class="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            :class="[
              showSearchBar 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            ]"
          >
            <svg v-if="!showSearchBar" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            {{ showSearchBar ? 'Fermer' : 'Ajouter une action' }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Barre de recherche modernisée -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div v-if="showSearchBar" class="mb-8">
        <div class="relative max-w-2xl mx-auto">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              ref="searchInput"
              type="text"
              v-model="searchQuery"
              @input="searchSymbols"
              @keydown.escape="closeSearchBar"
              placeholder="Rechercher une action (ex: AAPL, TSLA, MSFT)..."
              class="w-full pl-12 pr-16 py-4 text-lg rounded-2xl border-2 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
              :class="[
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-900 focus:border-blue-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              ]"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <svg class="h-5 w-5" :class="[isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Résultats de recherche améliorés -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div v-if="searchResults.length > 0" 
              class="absolute z-50 w-full mt-2 rounded-2xl border shadow-2xl overflow-hidden"
              :class="[isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200']"
            >
              <div class="max-h-80 overflow-y-auto">
                <div
                  v-for="(result, index) in searchResults.slice(0, 8)"
                  :key="result.symbol"
                  @click="addToWatchlist(result)"
                  class="p-4 cursor-pointer transition-all duration-150 flex items-center justify-between group"
                  :class="[
                    isDarkMode 
                      ? 'hover:bg-gray-700 border-b border-gray-700' 
                      : 'hover:bg-blue-50 border-b border-gray-100',
                    index === searchResults.slice(0, 8).length - 1 ? 'border-b-0' : ''
                  ]"
                >
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                           :class="[isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700']">
                        {{ result.symbol.charAt(0) }}
                      </div>
                      <div>
                        <div class="font-bold text-lg" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                          {{ result.symbol }}
                        </div>
                        <div class="text-sm line-clamp-1" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                          {{ result.description }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <svg class="w-5 h-5" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>

    <!-- Statistiques de portfolio -->
    <Transition
      appear
      enter-active-class="transition duration-600 ease-out"
      enter-from-class="opacity-0 translate-y-6"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="p-6 rounded-2xl shadow-lg" :class="[isDarkMode ? 'bg-gray-800' : 'bg-white']">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">Actions suivies</p>
              <p class="text-2xl font-bold" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">{{ watchlist.length }}</p>
            </div>
          </div>
        </div>

        <div class="p-6 rounded-2xl shadow-lg" :class="[isDarkMode ? 'bg-gray-800' : 'bg-white']">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">Marché ouvert</p>
              <p class="text-2xl font-bold text-green-500">{{ isMarketOpen ? 'Ouvert' : 'Fermé' }}</p>
            </div>
          </div>
        </div>

        <div class="p-6 rounded-2xl shadow-lg" :class="[isDarkMode ? 'bg-gray-800' : 'bg-white']">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">Dernière MàJ</p>
              <p class="text-lg font-bold" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">{{ lastUpdate }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Liste de suivi modernisée -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-6" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
        Ma liste de suivi
      </h2>
      
      <div v-if="watchlist.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" 
             :class="[isDarkMode ? 'bg-gray-800' : 'bg-gray-100']">
          <svg class="w-12 h-12" :class="[isDarkMode ? 'text-gray-600' : 'text-gray-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2" :class="[isDarkMode ? 'text-gray-300' : 'text-gray-600']">
          Aucune action dans votre liste de suivi
        </h3>
        <p class="mb-4" :class="[isDarkMode ? 'text-gray-500' : 'text-gray-500']">
          Commencez par ajouter des actions à surveiller
        </p>
        <button
          @click="toggleSearchBar"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
        >
          Ajouter une action
        </button>
      </div>

      <TransitionGroup
        v-else
        appear
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
        move-class="transition duration-300"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <div
          v-for="stock in watchlist"
          :key="stock.symbol"
          class="group p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border"
          :class="[
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          ]"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                   :class="[isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700']">
                {{ stock.symbol.charAt(0) }}
              </div>
              <div>
                <h3 class="text-xl font-bold" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                  {{ stock.symbol }}
                </h3>
                <p class="text-sm line-clamp-1" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                  {{ stock.description }}
                </p>
              </div>
            </div>
            <button
              @click="removeFromWatchlist(stock.symbol)"
              class="opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                Prix actuel
              </span>
              <span class="text-2xl font-bold" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                ${{ formatPrice(stock.quote?.c) }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm font-medium" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                Variation
              </span>
              <div class="flex items-center gap-1">
                <svg v-if="stock.quote?.dp > 0" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                <svg v-else class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="font-bold" :class="[
                  stock.quote?.dp > 0 ? 'text-green-500' : 'text-red-500'
                ]">
                  {{ stock.quote?.dp > 0 ? '+' : '' }}{{ (stock.quote?.dp || 0).toFixed(2) }}%
                </span>
              </div>
            </div>

            <div class="pt-3 border-t" :class="[isDarkMode ? 'border-gray-700' : 'border-gray-200']">
              <div class="h-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                <canvas :id="'chart-' + stock.symbol" class="w-full h-full"></canvas>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Convertisseur de devises modernisé -->
    <Transition
      appear
      enter-active-class="transition duration-700 ease-out"
      enter-from-class="opacity-0 translate-y-6"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="p-6 rounded-2xl shadow-lg" :class="[isDarkMode ? 'bg-gray-800' : 'bg-white']">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
            Convertisseur de devises
          </h2>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2" :class="[isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  Montant
                </label>
                <input
                  type="number"
                  v-model="currencyAmount"
                  class="w-full p-3 rounded-xl border-2 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  :class="[isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300']"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2" :class="[isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  De
                </label>
                <select
                  v-model="fromCurrency"
                  class="w-full p-3 rounded-xl border-2 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  :class="[isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300']"
                >
                  <option v-for="currency in currencies" :key="currency" :value="currency">
                    {{ currency }}
                  </option>
                </select>
              </div>
            </div>

            <div class="text-center">
              <button class="p-2 rounded-full" :class="[isDarkMode ? 'bg-gray-700' : 'bg-gray-100']">
                <svg class="w-5 h-5" :class="[isDarkMode ? 'text-gray-300' : 'text-gray-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2" :class="[isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  Vers
                </label>
                <select
                  v-model="toCurrency"
                  class="w-full p-3 rounded-xl border-2 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  :class="[isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300']"
                >
                  <option v-for="currency in currencies" :key="currency" :value="currency">
                    {{ currency }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2" :class="[isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  Résultat
                </label>
                <div class="w-full p-3 rounded-xl border-2 font-bold text-lg"
                     :class="[isDarkMode ? 'bg-gray-700 border-gray-600 text-green-400' : 'bg-gray-50 border-gray-300 text-green-600']">
                  {{ formatAmount(convertedAmount) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actualités du marché modernisées -->
        <div class="p-6 rounded-2xl shadow-lg" :class="[isDarkMode ? 'bg-gray-800' : 'bg-white']">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            Actualités du marché
          </h2>
          
          <div class="space-y-4 max-h-80 overflow-y-auto">
            <TransitionGroup
              enter-active-class="transition duration-500 ease-out"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              move-class="transition duration-500"
            >
              <div
                v-for="news in marketNews"
                :key="news.id"
                class="p-4 rounded-xl border transition-all duration-200 hover:shadow-md"
                :class="[isDarkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-200 hover:border-gray-300']"
              >
                <h3 class="font-bold mb-2 line-clamp-2" :class="[isDarkMode ? 'text-white' : 'text-gray-900']">
                  {{ news.headline }}
                </h3>
                <p class="text-sm mb-3 line-clamp-2" :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                  {{ news.summary }}
                </p>
                <a
                  :href="news.url"
                  target="_blank"
                  class="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Lire plus
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </TransitionGroup>
            </div>
          </div>
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