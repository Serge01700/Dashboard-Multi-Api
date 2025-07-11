<template>
  <div class="w-full h-80">
    <div v-if="chartError" class="text-red-500 text-center py-8">{{ chartError }}</div>
    <Line v-else-if="chartData" :data="chartData" :options="{responsive:true}" />
    <div v-else class="text-center py-8">Chargement du graphique...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { finnhubService } from '@/services/finnhub'
import { Line } from 'vue-chartjs'

const props = defineProps({
  symbol: String,
  isDarkMode: Boolean
})

const chartData = ref(null)
const chartError = ref(null)

const fetchChart = async () => {
  chartError.value = null
  try {
    const now = new Date()
    const from = new Date(now)
    from.setDate(now.getDate() - 30)
    const candles = await finnhubService.getCandles(props.symbol, 'D', from, now)
    if (!candles || candles.s !== 'ok' || !candles.c) {
      chartError.value = "Aucune donnée disponible pour ce symbole."
      return
    }
    chartData.value = {
      labels: candles.t.map(ts => new Date(ts * 1000).toLocaleDateString('fr-FR')),
      datasets: [{
        label: props.symbol,
        data: candles.c,
        borderColor: props.isDarkMode ? '#60a5fa' : '#1e293b',
        backgroundColor: props.isDarkMode ? 'rgba(96,165,250,0.2)' : 'rgba(30,41,59,0.2)',
        tension: 0.2
      }]
    }
  } catch (e) {
    chartError.value = "Erreur lors du chargement du graphique."
    console.error(e)
  }
}

onMounted(fetchChart)
watch(() => props.symbol, fetchChart)
</script>