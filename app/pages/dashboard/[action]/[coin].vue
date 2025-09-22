<template>
  <div class="action">
    <div class="header text-white gap-4 flex items-center w-full">
      <AppBackHeader class="w-fit" />
      <h1 class="text-2xl font-bold capitalize">
        {{ action }} {{ coin?.name }}
      </h1>
    </div>
    <div class="px-6 min-h-screen bg-use text-white flex flex-col gap-6">

      <!-- SEND -->
      <div v-if="action === 'send'">
        <div v-if="coin" class="py-6 min-h-screen bg-use text-white flex flex-col gap-6">
          <!-- Header -->
          <div class="flex items-center flex-col">
            <div class="img w-12 h-12">
              <img :src="coin.image" class="w-full h-full" :alt="coin.name" />
            </div>
            <h1 class="text-xl font-bold">
              {{ coin.name }} ({{ coin.symbol.toUpperCase() }})
            </h1>
            <div class="alert">
              <p class="text-sm text-gray-400 text-center">
                You are about to send {{ coin?.symbol }}. Please ensure the address
                is correct. Transactions cannot be reversed.
              </p>
            </div>
          </div>

          <!-- Form -->
          <div class="form">
            <form class="flex flex-col gap-4">
              <!-- Network dropdown -->
              <div class="flex flex-col gap-2">
                <label for="network" class="font-semibold">Select Network</label>
                <select
                  id="network"
                  v-model="selectedNetwork"
                  class="p-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none w-full capitalize"
                >
                  <option
                    v-for="addr in coinAddresses"
                    :key="addr.network"
                    :value="addr.network"
                  >
                    {{ addr.network.toUpperCase() }}
                  </option>
                </select>
              </div>

              <!-- Recipient -->
              <div class="flex flex-col gap-2">
                <label for="address" class="font-semibold">Recipient Address</label>
                <input
                  type="text"
                  id="address"
                  class="p-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none w-full"
                  placeholder="Enter recipient address"
                />
              </div>

              <!-- Amount -->
              <div class="flex flex-col gap-2">
                <label for="amount" class="font-semibold">Amount ({{ coin?.symbol }})</label>
                <input
                  type="number"
                  id="amount"
                  class="p-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none w-full"
                  placeholder="Enter amount to send"
                />
                <div class="balance">
                  Balance:
                  {{ coinAddresses.find(a => a.network === selectedNetwork)?.coinbal || 0 }}
                  {{ coin.symbol }}
                </div>
              </div>

              <!-- Submit -->
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-4"
                @click.prevent="send(coinId, selectedNetwork)"
              >
                Send {{ coin?.symbol }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- RECEIVE -->
      <div v-else-if="action === 'receive'">
        <div v-if="coin" class="py-6 min-h-screen bg-use text-white flex flex-col gap-6">
          <!-- Header -->
          <div class="flex items-center flex-col">
            <div class="img w-12 h-12">
              <img :src="coin.image" class="w-full h-full" :alt="coin.name" />
            </div>
            <h1 class="text-xl font-bold">
              {{ coin.name }} ({{ coin.symbol.toUpperCase() }})
            </h1>
          </div>

          <!-- Network dropdown -->
          <div class="flex flex-col gap-2">
            <label for="network" class="font-semibold">Select Network</label>
            <select
              id="network"
              v-model="selectedNetwork"
              class="p-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none w-full capitalize"
            >
              <option
                v-for="addr in coinAddresses"
                :key="addr.network"
                :value="addr.network"
              >
                {{ addr.network.toUpperCase() }}
              </option>
            </select>
          </div>

          <!-- QR + Address -->
          <div class="flex flex-col items-center gap-4">
            <p class="text-sm text-gray-400 text-center">
              Scan the QR code or copy the address to receive {{ coin.symbol }}.
            </p>
            <div class="qr-code bg-white p-4 rounded-lg">
              <img
                :src="`https://api.qrserver.com/v1/create-qr-code/?data=${currentAddress}&size=150x150`"
                alt="QR Code"
              />
            </div>
            <p class="font-semibold">
              Your {{ coin.symbol }} Address ({{ selectedNetwork?.toUpperCase() }}):
            </p>
            <div
              class="bg-gray-800 p-4 rounded-lg text-center truncate w-full max-w-md cursor-pointer"
              @click="copyAddress"
            >
              {{ currentAddress || "No address found." }}
            </div>
          </div>

          <div class="end">
            <p class="text-sm text-gray-400 text-center mt-6">
              Ensure you only send {{ coin.symbol }} to this address. Sending
              any other coin may result in permanent loss.
            </p>
          </div>
        </div>
      </div>

      <!-- UNKNOWN -->
      <div v-else>
        <p>Unknown action: {{ action }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useRequireAuth } from "~/composables/useRequireAuth";
import { ref, computed, watch, onMounted } from "vue";

const route = useRoute();
const user = useState("user");
const action = ref(route.params.action);
const coinId = ref(route.params.coin);
const coin = ref(null);
useRequireAuth();

async function copyAddress() {
  const address = currentAddress.value
  if (!address) {
    alert("No address found.")
    return
  }

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(address)
    } else {
      const textarea = document.createElement("textarea")
      textarea.value = address
      textarea.style.position = "fixed"
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }
    alert(`Copied: ${address}`)
  } catch (err) {
    alert(`Failed to copy: ${err}`)
  }
}


const selectedNetwork = ref(null);

// Computed: addresses for current coin
const coinAddresses = computed(() => {
  if (!coin.value) return [];
  return user.value?.addresses?.filter(
    (addr) => addr.currency.toLowerCase() === coin.value.symbol.toLowerCase()
  ) || [];
});


// Watcher: default network
watch(coinAddresses, (newAddrs) => {
  if (newAddrs.length > 0 && !selectedNetwork.value) {
    selectedNetwork.value = newAddrs[0].network;
  }
});

// Helper: current address
const currentAddress = computed(() => {
  return coinAddresses.value.find((a) => a.network === selectedNetwork.value)?.address || "";
});

function send(coinId, network) {
  console.log("Sending", coinId, "on", network);
  // TODO: hook into your send API
}

onMounted(() => {
  console.log("Action:", action.value, "Coin ID:", coinId.value);
  const ws = new WebSocket("wss://soljan.onrender.com");

  ws.onopen = () => {
    console.log("✅ Connected to WebSocket");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const match = data.find((c) => c.id === coinId.value);
    if (match) {
      coin.value = match;
    }
  };
});
</script>
