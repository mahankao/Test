<template>
  <nav class="nav-bar">
    <router-link
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="nav-link"
        active-class="active"
    >
      {{ item.label }}
    </router-link>
  </nav>
  <router-view />
</template>

<script setup lang="ts">
const menu = [
  { path: '/incomes', label: 'Incomes' },
  { path: '/orders', label: 'Orders' },
  { path: '/sales', label: 'Sales' },
  { path: '/stocks', label: 'Stocks' },
]
</script>

<style scoped>
.nav-bar {
  display: flex;
  gap: 16px;
  background-color: #1e293b; /* тёмный фон */
  padding: 12px 24px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.nav-link {
  color: #f1f5f9; /* светлый текст */
  text-decoration: none;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}

.nav-link:hover {
  background-color: #3b82f6; /* голубая подсветка */
  color: white;
}

.nav-link.active {
  background-color: #2563eb; /* активная подсветка */
  color: white;
  font-weight: 600;
}
</style>
