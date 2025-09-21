<script setup lang="ts">
import { defineProps, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData,
  type ChartDataset
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  labels: string[]
  values: number[]
}>()
const chartData = computed<ChartData<'bar', number[], string>>(() => ({
  labels: props.labels ?? [],
  datasets: [
    {
      label: 'Сумма продажи',
      data: props.values ?? [],
      backgroundColor: '#fd5555'
    } as ChartDataset<'bar', number[]>
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' as const },
    title: { display: true, text: 'Столбчатый график продаж после скидки' }
  },
  scales: {
    y: { beginAtZero: true },
    x: { ticks: { autoSkip: false } }
  }
}
</script>

<template>
  <div style="height:360px;">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
