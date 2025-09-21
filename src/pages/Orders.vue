<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchOrders } from '@/api/wbApi'
import dayjs from 'dayjs'
import GraphOrders from "@/graph/GraphOrders.vue";

// Данные
const orders = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const limit = ref(100)

// Фильтры
const dateFrom = ref('2025-09-16')
const dateTo = ref(dayjs().format('YYYY-MM-DD'))
const selectedWarehouse = ref('')
const selectedOblast = ref('')

// Загрузка данных
async function loadOrders() {
  loading.value = true
  try {
    const res = await fetchOrders({
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      page: page.value,
      limit: limit.value
    })
    orders.value = res.data?.data || res.data || []
  } catch (err) {
    console.error('Ошибка загрузки заказов', err)
    orders.value = []
  } finally {
    loading.value = false
  }
}
onMounted(loadOrders)

// Уникальные значения для фильтров
const uniqueWarehouses = computed(() =>
    [...new Set(orders.value.map(o => o.warehouse_name))]
)
const uniqueOblasts = computed(() =>
    [...new Set(orders.value.map(o => o.oblast))]
)

// Отфильтрованные заказы
const filteredOrders = computed(() =>
    orders.value.filter(o =>
        (!selectedWarehouse.value || o.warehouse_name === selectedWarehouse.value) &&
        (!selectedOblast.value || o.oblast === selectedOblast.value)
    )
)
// Готовим данные для графика (сумма товаров по дате)
const chartLabels = computed(() => {
  const datesSet = new Set(filteredOrders.value.map(i => i.date))
  return Array.from(datesSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )
})

const chartValues = computed(() =>
    chartLabels.value.map(d =>
        filteredOrders.value
            .filter(i => i.date === d)
            .reduce((sum, i) => sum + Number(i.total_price || 0), 0)
    )
)

</script>

<template>
  <div class="orders-page">
    <h1>Orders</h1>

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
        Регион:
        <select v-model="selectedOblast">
          <option value="">Все</option>
          <option v-for="o in uniqueOblasts" :key="o" :value="o">{{ o }}</option>
        </select>
      </label>

      <button @click="loadOrders" :disabled="loading">
        {{ loading ? 'Загрузка...' : 'Обновить' }}
      </button>
    </div>

    <GraphOrders :labels="chartLabels" :values="chartValues" />

    <!-- Таблица -->
    <div v-if="filteredOrders.length === 0 && !loading">Нет данных за выбранный период</div>
    <table v-else>
      <thead>
      <tr>
        <th>Дата</th>
        <th>Номер</th>
        <th>Артикул</th>
        <th>Размер</th>
        <th>Штрихкод</th>
        <th>Сумма</th>
        <th>Склад</th>
        <th>Регион</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in filteredOrders" :key="item.g_number">
        <td>{{ item.date }}</td>
        <td>{{ item.g_number }}</td>
        <td>{{ item.supplier_article }}</td>
        <td>{{ item.tech_size }}</td>
        <td>{{ item.barcode }}</td>
        <td>{{ item.total_price }}</td>
        <td>{{ item.warehouse_name }}</td>
        <td>{{ item.oblast }}</td>
      </tr>
      </tbody>
    </table>

    <!-- Пагинация -->
    <div class="pagination">
      <button @click="page--, loadOrders()" :disabled="page === 1">Назад</button>
      <span>Страница {{ page }}</span>
      <button @click="page++, loadOrders()">Вперёд</button>
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  padding: 16px;
}
.filters {
  margin-bottom: 12px;
}
.filters label {
  margin-right: 12px;
}
table {
  border-collapse: collapse;
  width: 100%;
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
.chart {
  margin: 20px 0;
}
</style>