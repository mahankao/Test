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
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  labels: string[]
  values: number[]
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Количество товаров',
      data: props.values,
      backgroundColor: '#46c54f',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: true, text: 'Количество товаров по дате' },
  },
  scales: {
    y: { beginAtZero: true },
  },
}
</script>

<template>
  <div style="height:360px;">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
