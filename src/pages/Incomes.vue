<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchIncomes } from '@/api/wbApi'
import dayjs from 'dayjs'
import GraphIncomes from '@/graph/GraphIncomes.vue'

// Данные
const incomes = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const limit = ref(100)

// Фильтры
const dateFrom = ref(dayjs().subtract(30, 'day').format('YYYY-MM-DD'))
const dateTo = ref(dayjs().format('YYYY-MM-DD'))
const selectedWarehouse = ref('')
const selectedArticle = ref('')

// Загрузка данных
async function loadIncomes() {
  loading.value = true
  try {
    const res = await fetchIncomes({
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      page: page.value,
      limit: limit.value
    })
    incomes.value = res.data || res.data?.data || []
  } catch (err) {
    console.error('Ошибка загрузки доходов', err)
    incomes.value = []
  } finally {
    loading.value = false
  }
}
onMounted(loadIncomes)

// Уникальные значения для фильтров
const uniqueWarehouses = computed(() =>
    [...new Set(incomes.value.map(i => i.warehouse_name))]
)
const uniqueArticles = computed(() =>
    [...new Set(incomes.value.map(i => i.supplier_article))]
)

// Фильтрованные данные
const filteredIncomes = computed(() =>
    incomes.value.filter(i =>
        (!selectedWarehouse.value || String(i.warehouse_name).trim() === selectedWarehouse.value.trim()) &&
        (!selectedArticle.value || String(i.supplier_article).trim() === selectedArticle.value.trim())
    )
)


const chartLabels = computed(() => {
  const datesSet = new Set(filteredIncomes.value.map(i => i.date))
  return Array.from(datesSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
})

const chartValues = computed(() => {
  return chartLabels.value.map(d =>
      filteredIncomes.value
          .filter(i => i.date === d)
          .reduce((sum, i) => sum + Number(i.quantity || 0), 0)
  )
})


</script>

<template>
  <div class="incomes-page">
    <h1>Incomes</h1>

    <!-- Фильтры -->
    <div class="filters">
      <label>
        From:
        <input type="date" v-model="dateFrom" />
      </label>
      <label>
        To:
        <input type="date" v-model="dateTo" />
      </label>
      <label>
        Склад:
        <select v-model="selectedWarehouse">
          <option value="">Все</option>
          <option v-for="w in uniqueWarehouses" :key="w" :value="w">{{ w }}</option>
        </select>
      </label>
      <label>
        Артикул:
        <select v-model="selectedArticle">
          <option value="">Все</option>
          <option v-for="a in uniqueArticles" :key="a" :value="a">{{ a }}</option>
        </select>
      </label>
      <button @click="loadIncomes" :disabled="loading">
        {{ loading ? 'Загрузка...' : 'Обновить' }}
      </button>
    </div>

    <!-- График -->
    <GraphIncomes :labels="chartLabels" :values="chartValues" />

    <!-- Таблица -->
    <div v-if="filteredIncomes.length === 0 && !loading">Нет данных за выбранный период</div>
    <table v-else>
      <thead>
      <tr>
        <th>Дата</th>
        <th>Склад</th>
        <th>Артикул</th>
        <th>Штрихкод</th>
        <th>Количество</th>
        <th>Сумма</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in filteredIncomes" :key="item.income_id">
        <td>{{ item.date }}</td>
        <td>{{ item.warehouse_name }}</td>
        <td>{{ item.supplier_article }}</td>
        <td>{{ item.barcode }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.total_price }}</td>
      </tr>
      </tbody>
    </table>

    <!-- Пагинация -->
    <div class="pagination">
      <button @click="page--, loadIncomes()" :disabled="page === 1">Назад</button>
      <span>Страница {{ page }}</span>
      <button @click="page++, loadIncomes()">Вперёд</button>
    </div>
  </div>
</template>

<style scoped>
.filters {
  margin-bottom: 16px;
}
.filters label {
  margin-right: 12px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}
th, td {
  border: 1px solid #ccc;
  padding: 6px 12px;
  text-align: left;
}

.pagination {
  margin-top: 12px;
}
</style>
