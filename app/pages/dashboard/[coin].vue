<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useRequireAuth } from "~/composables/useRequireAuth";
import { useAuth } from "~/composables/useAuth";

const route = useRoute();
const coinId = route.params.coin; // e.g. "bitcoin", "usd-coin", "binancecoin"
const coin = ref(null);
const userBalance = ref(null);
const user = useState("user");
useRequireAuth();

// Example: map IDs to user.address index
const idToAddressIndex = {
  // bitcoin: 2,
  ethereum: 0,
  solana: 5,
  tether: 4,
  "usd-coin": 1,
  binancecoin: 2,
  // tron: 4,
  sui: 3,
};
const idx = idToAddressIndex[coinId];
onMounted(() => {
  const ws = new WebSocket("wss://soljan.onrender.com");

  ws.onopen = () => {
    console.log("✅ Connected to WebSocket");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // Find the coin from the array
    const match = data.find((c) => c.id === coinId);
    if (match) {
      coin.value = match;

      // match balance from user.addresses

      if (typeof idx !== "undefined" && user?.addresses?.[idx]) {
        userBalance.value = user?.addresses[idx];
      }
    }
  };
});
</script>

<template>

  <AppBackHeader />
  <div
    v-if="coin"
    class="p-6 min-h-screen bg-use text-white flex flex-col gap-6"
  >
    <!-- Header -->
    <div class="flex items-center gap-4 flex-col">
      <div class="img w-20 h-20 mx-auto">
        <img :src="coin.image" class="w-full h-full" :alt="coin.name" />
      </div>
      <h1 class="text-xl font-bold">
        {{ coin.name }} ({{ coin.symbol.toUpperCase() }})
      </h1>
    </div>

    <AppUseronlyTransact />

    <div class="mt-6 p-4 rounded flex justify-between">

      <div><p class="font-semibold">Current Price:</p>₦{{ coin.current_price.toLocaleString() }}</div>
      <div class="text-right">
      <h2 class="font-semibold">Your HODL</h2>
        <p>
          {{ Number(user?.addresses[idToAddressIndex[coinId]].coinbal).toLocaleString() }}
          {{ coin.symbol }}
        </p>
        <p class="text-xs text-gray-400">
          ₦{{ Number(user?.addresses[idToAddressIndex[coinId]].ngnbalance).toLocaleString() }}
        </p>
      </div>
    </div>

    <!-- Market Data -->
    <div class="mt-4 flex flex-wrap justify-between gap-4 text-sm">
      <div class="flex flex-col">Market Cap: <span>₦{{ coin.market_cap.toLocaleString() }}</span></div>
      <div class="flex flex-col">24h High: <span>₦{{ coin.high_24h.toLocaleString() }}</span></div>
      <div class="flex flex-col">24h Low: <span>₦{{ coin.low_24h.toLocaleString() }}</span></div>
      <div class="flex flex-col">24h Change: <span>{{ coin.price_change_percentage_24h.toFixed(2) }}%</span></div>
    </div>

    <!-- Chart -->
    <div class="mt-8">
      <AppCryptochart :coinId="coin.id" />
    </div>
  </div>

  <div v-else class="p-6 text-gray-500 flex flex-col items-center gap-4">
    <div class="img rounded-full h-20 w-20 bg-gray-400"></div>
    <div class="coinName">{{ coinId }}</div>
    <h2 class="font-semibold">Your HODL</h2>
    <div>
      {{ user?.addresses[idToAddressIndex[coinId]].coinbal }}
      <!-- {{ coin.symbol }} -->
      <p>₦{{ user?.addresses[idToAddressIndex[coinId]].ngnbalance }}</p>
    </div>

    <AppUseronlyTransact />
  </div>
</template>
