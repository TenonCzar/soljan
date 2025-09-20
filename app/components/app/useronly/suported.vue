<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const coins = [
  { id: "bitcoin", symbol: "BTC", img: "/images/coins/btc.svg", idx: 2 },
  { id: "solana", symbol: "SOL", img: "/images/coins/solana.svg", idx: 5 },
  { id: "tether", symbol: "USDT", img: "/images/coins/tether.svg", idx: 3 },
  { id: "ethereum", symbol: "ETH", img: "/images/coins/eth.svg", idx: 0 },
  { id: "binancecoin", symbol: "BNB", img: "/images/coins/bnb.svg", idx: 1 },
  { id: "usd-coin", symbol: "USDC", img: "/images/coins/usdc.svg", idx: 6 },
];

const user = useState("user"); // global reactive user
const livePrices = ref({}); // { bitcoin: 40000, ethereum: 2000 ... }
let ws;

function navigateTo(url) {
  router.push(url);
}

// Smoothly animate ngnbalance changes
function animateBalance(idx, target) {
  if (!user.value?.addresses?.[idx]) return;

  const current = parseFloat(user.value.addresses[idx].ngnbalance || 0);
  const step = (target - current) / 10;
  let i = 0;

  function stepAnimation() {
    if (i < 10) {
      user.value.addresses[idx].ngnbalance = (current + step * i).toFixed(2);
      i++;
      requestAnimationFrame(stepAnimation);
    } else {
      user.value.addresses[idx].ngnbalance = target.toFixed(2);
    }
  }

  stepAnimation();
}

// Update balance locally + backend
async function updateBalance(idx, coinId, coinbal, price) {
  if (!user.value?.addresses?.[idx]) return;

  const ngnbalance = coinbal * price;
  animateBalance(idx, ngnbalance);

  // Save to localStorage
  localStorage.setItem("user", JSON.stringify(user.value));

  // Silent backend update
  try {
    const token = localStorage.getItem("auth_token");
    await fetch("/api/updateBalance", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ₦{token}`,
      },
      body: JSON.stringify({
        coinId,
        coinbal,
        currentPrice: price,
      }),
    });
  } catch (e) {
    console.error("Failed to update balance backend:", e);
  }
}

onMounted(() => {
  ws = new WebSocket("wss://soljan.onrender.com");

  ws.onopen = () => console.log("✅ WebSocket connected");

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      data.forEach((c) => {
        livePrices.value[c.id] = c.current_price;

        const coinIdx = coins.findIndex((co) => co.id === c.id);
        if (coinIdx === -1 || !user.value?.addresses?.[coins[coinIdx].idx])
          return;

        const coinbal = parseFloat(
          user.value.addresses[coins[coinIdx].idx].coinbal || 0
        );
        if (coinbal > 0) {
          updateBalance(coins[coinIdx].idx, c.id, coinbal, c.current_price);
        }
      });
    } catch (e) {
      console.error("WS parse error:", e);
    }
  };
});

onBeforeUnmount(() => {
  if (ws) ws.close();
});
</script>

<template>
  <div class="crypto-assets flex flex-col gap-4 mt-4">
    <h2 class="text-left mt-4">Crypto Balance</h2>

    <div
      v-for="coin in coins"
      :key="coin.id"
      class="flex gap-2 items-center bg-gray-500/20 p-4 rounded-lg hover:bg-white/30 cursor-pointer cursor-shadow-md"
      @click="navigateTo(`/dashboard/₦{coin.id}`)"
    >
      <div
        class="img bg-white p-2 rounded-full flex items-center justify-center w-fit"
      >
        <img :src="coin.img" class="w-4 h-4" :alt="coin.symbol" />
      </div>

      <div class="name text-xs flex flex-col text-left capitalize">
        {{ user?.addresses[coin.idx]?.currency }}
        <span>{{ coin.symbol }}</span>
      </div>

      <div class="numbers flex flex-col items-end ml-auto">
        <div class="balance rubik text-sm">
          ₦{{ user?.addresses[coin.idx]?.ngnbalance || "0.00" }}
        </div>
        <div class="price text-xs font-thin rubik">
          {{ user?.addresses[coin.idx]?.coinbal || "0" }}
        </div>
      </div>
    </div>
  </div>
</template>
