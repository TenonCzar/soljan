<template>
  <div
    class="flex flex-col text-center justify-between items-center mt-12 gap-6"
  >
    <div class="balance">
      <div class="amount relative rubik text-4xl">
        {{ user?.balance || "0.00"
        }}<span
          class="currency text-sm absolute disabled:text-ellipsis disabled:text-xs"
          :disabled="loading"
          >₦</span
        >
      </div>
      <p class="cursor-no-event">
        Account Balance
        <span
          class="refresh cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed in-disabled:rotate-12"
          @click="refreshBalances"
          :disabled="loading"
          >🔄</span
        >
      </p>
    </div>
    <div class="actions flex justify-between w-full px-6">
      <div class="send text-center flex flex-col items-center">
        <div
          class="border rounded-full border-blue-900 w-fit h-fit p-2 text-2xl flex items-center justify-center"
          @click="navigateTo('/dashboard/buy')"
        >
          <Icon name="mdi:database-check-outline" />
        </div>
        <p class="tag text-xs">Buy</p>
      </div>
      <div class="send text-center flex flex-col items-center">
        <div
          class="border rounded-full border-blue-900 w-fit h-fit p-2 text-2xl flex items-center justify-center"
          @click="navigateTo('/dashboard/buy')"
        >
          <Icon name="mdi:bookmark-minus-outline" />
        </div>
        <p class="tag text-xs">Sell</p>
      </div>
      <div
        class="send text-center flex flex-col items-center"
        @click="navigateTo('/dashboard/send')"
      >
        <div
          class="border rounded-full border-blue-900 w-fit h-fit p-2 text-xl flex items-center justify-center -rotate-45"
        >
          <Icon name="mdi:send" />
        </div>
        <p class="tag text-xs">Send</p>
      </div>
      <div
        class="receive text-center flex flex-col items-center"
        @click="navigateTo('/dashboard/receive')"
      >
        <div
          class="border rounded-full border-blue-900 w-fit h-fit p-2 text-xl flex items-center justify-center rotate-90"
        >
          <Icon name="mdi:exit-to-app" />
        </div>
        <p class="tag text-xs">Receive</p>
      </div>
    </div>

    <div class="assets w-full px-6">
      <div class="top rubik">Assets <Icon name="mdi:elipses" /></div>

      <div class="assets-balances">
        <div class="fiat flex flex-col gap-4">
          <h2 class="text-left mt-4">Fiat Balance</h2>
          <div
            class="ngn flex gap-2 items-center bg-gray-500/20 p-4 rounded-lg cursor-pointer hover:bg-white/30 cursor-shadow-md"
            @click="navigateTo('/dashboard/ngn')"
          >
            <div
              class="img bg-white p-2 rounded-full flex items-center justify-center w-fit"
            >
              <img src="/images/coins/ngn.svg" class="w-4 h-4" alt="ngn" />
            </div>
            <div class="name text-xs flex flex-col text-left">
              Naira <span>NGN</span>
            </div>
            <div class="numbers flex flex-col items-end ml-auto">
              <div class="balance rubik text-sm">
                ₦{{ nairaBalanceAmount || "0.00" }}
              </div>
              <div class="price text-xs font-thin rubik">
                {{ nairaAmount || "0" }}₦
              </div>
            </div>
          </div>
          <div
            class="usd flex gap-2 items-center bg-gray-500/20 p-4 rounded-lg cursor-pointer hover:bg-white/30 cursor-shadow-md"
            @click="navigateTo('/dashboard/usd')"
          >
            <div
              class="img bg-white rounded-full flex items-center justify-center w-fit"
            >
              <img src="/images/coins/usd.svg" class="w-9 h-9" alt="usd" />
            </div>
            <div class="name text-xs flex flex-col text-left">
              Dollar <span>USD</span>
            </div>
            <div class="numbers flex flex-col items-end ml-auto">
              <div class="balance rubik text-sm">
                ₦{{ usdBalanceAmount || "0.00" }}
              </div>
              <div class="price text-xs font-thin rubik">
                {{ usdAmount || "0" }}$
              </div>
            </div>
          </div>
        </div>

        <div class="crypto-assets flex flex-col gap-4 mt-4">
          <h2 class="text-left mt-4">Crypto Balance</h2>
          <div
            class="btc flex gap-2 items-center bg-gray-500/20 p-4 rounded-lg cursor-pointer hover:bg-white/30 cursor-shadow-md"
            @click="navigateTo(`/dashboard/${coin}`)"
          >
            <div
              class="img bg-white p-2 rounded-full flex items-center justify-center w-fit"
            >
              <img src="/images/coins/btc.svg" class="w-4 h-4" alt="bitcoin" />
            </div>
            <div class="name text-xs flex flex-col text-left capitalize">
              {{ user?.addresses[2].currency }} <span>BTC</span>
            </div>
            <div class="numbers flex flex-col items-end ml-auto">
              <div class="balance rubik text-sm">
                ₦{{ user?.addresses[2].ngnbalance }}
              </div>
              <div class="price text-xs font-thin rubik">
                {{ user?.addresses[2].coinbal || "0" }}
              </div>
            </div>
          </div>
          <div
            class="sol flex gap-2 items-center bg-gray-500/20 p-4 rounded-lg cursor-pointer hover:bg-white/30 cursor-shadow-md"
            @click="navigateTo(`/dashboard/${coin}`)"
          >
            <div
              class="img bg-white p-2 rounded-full flex items-center justify-center w-fit"
            >
              <img
                src="/images/coins/solana.svg"
                class="w-4 h-4"
                alt="solana"
              />
            </div>
            <div class="name text-xs flex flex-col text-left capitalize">
              {{ user?.addresses[5].currency }} <span>SOL</span>
            </div>
            <div class="numbers flex flex-col items-end ml-auto">
              <div class="balance rubik text-sm">
                ₦{{ user?.addresses[5].ngnbalance }}
              </div>
              <div class="price text-xs font-thin rubik">
                {{ user?.addresses[5].coinbal || "0" }}
              </div>
            </div>
          </div>
          <div
            class="tether flex gap-2 items-center bg-gray-500/20 p-4 rounded-lg cursor-pointer hover:bg-white/30 cursor-shadow-md"
            @click="navigateTo(`/dashboard/${coin}`)"
          >
            <div
              class="img bg-white p-2 rounded-full flex items-center justify-center w-fit"
            >
              <img
                src="/images/coins/tether.svg"
                class="w-4 h-4"
                alt="tether"
              />
            </div>
            <div class="name text-xs flex flex-col text-left">
              Tether <span>USDT</span>
            </div>
            <div class="numbers flex flex-col items-end ml-auto">
              <div class="balance rubik text-sm">
                ₦{{ user?.addresses[3].ngnbalance }}
              </div>
              <div class="price text-xs font-thin rubik">
                {{ user?.addresses[3].coinbal || "0" }}
              </div>
            </div>
          </div>
          <div
            class="eth flex gap-2 items-center bg-gray-500/20 p-4 rounded-lg cursor-pointer hover:bg-white/30 cursor-shadow-md"
            @click="navigateTo(`/dashboard/${coin}`)"
          >
            <div
              class="img bg-white p-2 rounded-full flex items-center justify-center w-fit"
            >
              <img src="/images/coins/eth.svg" class="w-4 h-4" alt="eth" />
            </div>
            <div class="name text-xs flex flex-col text-left">
              Ethereum <span>{{user?.addresses[0].currency}}</span>
            </div>
            <div class="numbers flex flex-col items-end ml-auto">
              <div class="balance rubik text-sm">
                ₦{{ user?.addresses[0].ngnbalance || "0.00" }}
              </div>
              <div class="price text-xs font-thin rubik">
                {{ user?.addresses[0].coinbal || "10" }}
              </div>
            </div>
          </div>
          <div
            class="bnb flex gap-2 items-center bg-gray-500/20 p-4 rounded-lg cursor-pointer hover:bg-white/30 cursor-shadow-md"
            @click="navigateTo(`/dashboard/${coin}`)"
          >
            <div
              class="img bg-white p-2 rounded-full flex items-center justify-center w-fit"
            >
              <img src="/images/coins/bnb.svg" class="w-4 h-4" alt="bnb" />
            </div>
            <div class="name text-xs flex flex-col text-left">
              Bnb <span>BNB</span>
            </div>
            <div class="numbers flex flex-col items-end ml-auto">
              <div class="balance rubik text-sm">
                ₦{{ user?.addresses[1].ngnbalance || "0.00" }}
              </div>
              <div class="price text-xs font-thin rubik">
                {{ user?.addresses[1].coinbal || "10" }}
              </div>
            </div>
          </div>
          <div
            class="tron flex gap-2 items-center bg-gray-500/20 p-4 rounded-lg cursor-pointer hover:bg-white/30 cursor-shadow-md"
            @click="navigateTo(`/dashboard/${coin}`)"
          >
            <div
              class="img bg-white p-2 rounded-full flex items-center justify-center w-fit"
            >
              <img src="/images/coins/usdc.svg" class="w-4 h-4" alt="usdc" />
            </div>
            <div class="name text-xs flex flex-col text-left capitalize">
              {{ user?.addresses[6].currency }} <span>USDC</span>
            </div>
            <div class="numbers flex flex-col items-end ml-auto">
              <div class="balance rubik text-sm">
                ₦{{user?.addresses[6].ngnbalance || "0.00"}}
              </div>
              <div class="price text-xs font-thin rubik">
                {{ user?.addresses[6].coinbal || "0" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRequireAuth } from "~/composables/useRequireAuth";
import { useAuth } from "~/composables/useAuth";
import { onMounted } from "vue";
const loading = ref(false);
// import { debounce } from 'lodash-es';
// const refreshBalances = debounce(updateDynamicFields, 1000);

useRequireAuth(); // Ensures auth check and periodic validation
const { user, updateDynamicFields } = useAuth();

onMounted(async () => {
  await updateDynamicFields(); // Fetch dynamic fields on load
});

async function refreshBalances() {
  loading.value = true;
  await updateDynamicFields();
  loading.value = false;
}
</script>
