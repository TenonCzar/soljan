<template>
  <div class="actionBtn w-fit mx-auto flex items-center gap-6">
    <button
      class="flex items-center p-2 gap-2 text-xs border rounded-full cursor-pointer"
      @click="userAction('Receive')"
    >
      Receive <Icon name="mdi:call-received" class="text-sm" action="send" />
    </button>
    <button
      class="flex items-center p-2 gap-2 text-xs border rounded-full cursor-pointer"
      @click="userAction('Send')"
    >
      Send <Icon name="mdi:send-outline" />
    </button>
    <button
      class="flex items-center p-2 gap-2 text-xs border rounded-full cursor-pointer"
      @click="userAction('Convert')"
    >
      Convert <Icon name="mdi:swap-horizontal-variant" class="text-sm" />
    </button>
  </div>
  <div
    class="min-h-screen w-full flex flex-col absolute top-0 left-0 bg-use"
    v-if="openModal"
  >
    <h2 class="text-lg font-semibold mb-4">{{ action.value }}</h2>
    <p class="mb-4">Select coin:</p>

    <ul class="space-y-2 overflow-y-auto">
      <li v-for="coin in coins" :key="coin.id">
        <button
          class="flex items-center py-4 px-6 gap-2 text-xs border rounded hover:border-gray-600 cursor-pointer w-full justify-between"
          @click="selectCoin(coin)"
        >
          <div class="flex items-center gap-4">
            <img :src="coin.img" class="w-4 h-4" :alt="coin.symbol" />
            {{ coin.symbol }}
          </div>
          <div class="right flex items-center gap-2">
            <div class="numbers flex flex-col items-end ml-auto">
              <div class="balance rubik text-sm">
                ₦{{ user?.addresses[coin.idx].ngnbalance || "0.00" }}
              </div>
              <div class="price text-xs font-thin rubik">
                {{ user?.addresses[coin.idx].coinbal || "0" }} {{ coin.symbol }}
              </div>
            </div>
            <Icon name="mdi:chevron-right" class="text-sm" />
          </div>
        </button>
      </li>
    </ul>

    <button class="mt-4 text-gray-500 cursor-pointer" @click="closeModal">
      Close
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useRequireAuth } from "~/composables/useRequireAuth";
const openModal = ref(false);
const user = useState("user");
const closeModal = () => {
  openModal.value = false;
};
useRequireAuth();
const selectCoin = (coin) => {
  console.log("Selected coin:", coin);
  // You can add further logic here, e.g., navigate to a transaction page or open another modal
};

const action = ref("");
const userAction = (act) => {
  action.value = act;
  openModal.value = true;
};

const coins = [
  { id: "bitcoin", symbol: "BTC", img: "/images/coins/btc.svg", idx: 2 },
  { id: "solana", symbol: "SOL", img: "/images/coins/solana.svg", idx: 5 },
  { id: "tether", symbol: "USDT", img: "/images/coins/tether.svg", idx: 3 },
  { id: "ethereum", symbol: "ETH", img: "/images/coins/eth.svg", idx: 0 },
  { id: "binancecoin", symbol: "BNB", img: "/images/coins/bnb.svg", idx: 1 },
  { id: "usd-coin", symbol: "USDC", img: "/images/coins/usdc.svg", idx: 6 },
];
</script>
