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
  bitcoin: 2, // adjust based on your user?.addresses structure
  ethereum: 0,
  solana: 5,
  tether: 3,
  "usd-coin": 6,
  binancecoin: 1,
  tron: 4,
  sui: 7,
};

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
      const idx = idToAddressIndex[coinId];
      if (typeof idx !== "undefined" && user?.addresses?.[idx]) {
        userBalance.value = user?.addresses[idx];
      }
    }
  };
});
</script>

<template>
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

    <div class="actionBtn w-fit mx-auto flex items-center gap-6">
      <button class="flex items-center p-2 gap-2 text-xs border rounded-full">
        Receive <Icon name="mdi:call-received" class="text-sm" />
      </button>
      <button class="flex items-center p-2 gap-2 text-xs border rounded-full">
        Send <Icon name="mdi:send-outline" />
      </button>
      <button class="flex items-center p-2 gap-2 text-xs border rounded-full">
        Convert <Icon name="mdi:swap-horizontal-variant" class="text-sm" />
      </button>
    </div>

    <div class="mt-6 p-4 rounded">
      <h2 class="font-semibold">Your HODL</h2>
      <div>
        {{ user?.addresses[idToAddressIndex[coinId]].coinbal }}
        {{ coin.symbol }}
        <p>
          ₦{{ user?.addresses[idToAddressIndex[coinId]].ngnbalance }} <br />
        </p>
      </div>
    </div>

    <!-- Market Data -->
    <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
      <div>Current Price: ₦{{ coin.current_price }}</div>
      <div>Market Cap: ₦{{ coin.market_cap.toLocaleString() }}</div>
      <div>24h High: ₦{{ coin.high_24h }}</div>
      <div>24h Low: ₦{{ coin.low_24h }}</div>
      <div>24h Change: {{ coin.price_change_percentage_24h.toFixed(2) }}%</div>
    </div>

    <!-- Chart -->
    <div class="mt-8">
      <AppCryptochart :coinId="coin.id" />
    </div>
  </div>

  <div v-else class="p-6 text-gray-500">Loading {{ coinId }} data...</div>
</template>
