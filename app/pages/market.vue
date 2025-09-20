<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const coins = ref([]);
let socket;

onMounted(() => {
  socket = new WebSocket("ws://localhost:4000");

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    console.log("📩 Message received:", event.data);
    coins.value = JSON.parse(event.data);
  };

  socket.onerror = (err) => {
    console.error("❌ WebSocket error:", err);
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket closed");
  };
});

onBeforeUnmount(() => {
  if (socket) socket.close();
});
</script>


<template>
  <div>
    <h1>Live Cryptocurrencies</h1>
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
</template>
