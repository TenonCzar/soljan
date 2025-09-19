<template>
  <div
    class="flex flex-col text-center justify-between items-center mt-12 gap-6"
  >
    <div class="balance">
      <div class="amount relative rubik text-4xl">
        0<span class="currency text-sm absolute">$</span>
      </div>
      <p>Account Balance</p>
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

    <div class="assets">
      <div class="top rubik">Assets <Icon name="mdi:elipses" /></div>

      <div class="assets-balances">
        <div class="tron">
          <div
            class="img bg-white p-2 rounded-full flex items-center justify-center w-fit"
          >
            <img src="/images/coins/tron.svg" class="w-4" alt="tron" />
          </div>
          <div class="name text-xs flex flex-col">Tron <span>TRX</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
