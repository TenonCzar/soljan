<!-- pages/coins.vue -->
<template>
  <div>
    <h1>Cryptocurrencies</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <ul>
        <li v-for="coin in coins" :key="coin.id">
          <img :src="coin.image" :alt="coin.name" width="20" />
          {{ coin.name }} ({{ coin.symbol.toUpperCase() }}): ${{ coin.current_price.toFixed(2) }}
          <span :class="coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ coin.price_change_percentage_24h.toFixed(2) }}%
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRequireAuth } from '~/composables/useRequireAuth';

useRequireAuth();

const coins = ref([]);
const loading = ref(false);
const error = ref('');
let refreshInterval = null;

async function fetchCoins() {
  if (loading.value) return;
  loading.value = true;
  error.value = '';
  try {
    const response = await $fetch('/api/coins');
    coins.value = response.coins;
  } catch (err) {
    console.error('Fetch coins error:', err);
    error.value = 'Failed to load coins';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchCoins();
  refreshInterval = setInterval(fetchCoins, 5 * 60 * 1000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});
</script>
