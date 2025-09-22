<template>
    <div class="bg-use">
    <AppBackHeader />
    <div class="p-6 min-h-screen bg-use text-white flex flex-col gap-6">
      <h1 class="text-2xl font-bold">Transaction Details</h1>
      <div class="mt-4">
        <p class="font-semibold">Transaction ID:</p>
        <p>{{ transactionId }}</p>
      </div>
      <div class="mt-4">
        <p class="font-semibold">Amount:</p>
        <p>{{ amount }}</p>
      </div>
      <div class="mt-4">
        <p class="font-semibold">Status:</p>
        <p>{{ status }}</p>
      </div>
    </div>
    </div>
</template>