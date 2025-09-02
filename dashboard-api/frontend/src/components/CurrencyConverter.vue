<template>
  <div :class="['m-4 h-[250px] md:h-[210px] p-4 max-w-lg rounded-3xl border', isDarkMode 
        ? 'bg-dark-card border-dark-border shadow-dark-shadow hover:shadow-dark-shadow-hover' 
        : 'bg-light border-light-border shadow-light-shadow hover:shadow-light-shadow-hover']">
    <h2 class="text-xl mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Currency converter</h2>
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
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { finnhubService } from '../services/finnhub'

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const currencyAmount = ref(1)
const fromCurrency = ref('USD')
const toCurrency = ref('EUR')
const convertedAmount = ref(0)
const currencies = ref(['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY'])

const updateConversion = async () => {
  if (currencyAmount.value && fromCurrency.value && toCurrency.value) {
    try {
      const result = await finnhubService.convertCurrency(
        currencyAmount.value,
        fromCurrency.value,
        toCurrency.value
      )
      convertedAmount.value = result
    } catch (error) {
      console.error('Erreur de conversion:', error)
    }
  }
}

const formatAmount = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0)
}

watch([currencyAmount, fromCurrency, toCurrency], updateConversion)

onMounted(async () => {
  await updateConversion()
})
</script> 