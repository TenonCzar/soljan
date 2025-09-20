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
    <AppUseronlyTransact />

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
                {{ usdAmount || "0" }}₦
              </div>
            </div>
          </div>
        </div>

        <AppUseronlySuported class="crypto-assets" />
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

useRequireAuth();
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
