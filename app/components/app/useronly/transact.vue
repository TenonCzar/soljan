<template>
  <div class="actionBtn w-fit mx-auto flex items-center gap-6">
    <button
      class="flex items-center p-2 gap-2 text-xs border rounded-full cursor-pointer"
      @click="userAction('Receive')"
    >
      Receive <Icon name="mdi:call-received" class="text-sm" />
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

  <!-- Modal -->
  <div
    class="min-h-screen w-full flex flex-col absolute top-0 left-0 bg-use z-50"
    v-if="modal"
  >
    <h2 class="text-lg font-semibold mb-4">{{ action }}</h2>
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
                ₦{{
                  Number(
                    user?.addresses[coin.idx].ngnbalance
                  ).toLocaleString() || "0.00"
                }}
              </div>
              <div class="price text-xs font-thin rubik">
                {{
                  Number(user?.addresses[coin.idx].coinbal).toLocaleString() ||
                  "0"
                }}
                {{ coin.symbol }}
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
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const modal = ref(false);
const action = ref("");
const user = useState("user");

const closeModal = () => {
  modal.value = false;
};
const openModal = () => {
  modal.value = true;
};

const userAction = (act) => {
  action.value = act;
  openModal();
};

useRequireAuth();
function navigateTo(url) {
  router.push(url);
}
const selectCoin = (coin) => {
  router.push(
    coin.id
      ? `/dashboard/${action.value.toLowerCase()}/${coin.id}`
      : `/dashboard/ngn/${action.value.toLowerCase()}`
  );
  closeModal();
};

const coins = [
  { id: "solana", symbol: "SOL", img: "/images/coins/solana.svg", idx: 3 },
  { id: "sui", symbol: "SUI", img: "/images/coins/sui.svg", idx: 4 },
  { id: "tether", symbol: "USDT", img: "/images/coins/tether.svg", idx: 8 },
  { id: "tron", symbol: "TRX", img: "/images/coins/tron.svg", idx: 5 },
  { id: "usd-coin", symbol: "USDC", img: "/images/coins/usdc.svg", idx: 6 },
  { id: "ethereum", symbol: "ETH", img: "/images/coins/eth.svg", idx: 2 },
  { id: "binancecoin", symbol: "BNB", img: "/images/coins/bnb.svg", idx: 1 },
];
</script>
