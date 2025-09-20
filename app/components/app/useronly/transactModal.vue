<template>
    <div class="min-h-screen w-full flex flex-col absolute top-0 left-0 bg-black/30" v-if="openModal">
        <div class="bg-white rounded-lg shadow-lg p-6 m-auto max-w-md">
            <h2 class="text-lg font-semibold mb-4">Transaction</h2>
            <p class="mb-4">Select an action:</p>
            <div class="flex justify-between">
                <button class="flex-1 bg-blue-500 text-white rounded-lg py-2 mx-1">Receive</button>
                <button class="flex-1 bg-blue-500 text-white rounded-lg py-2 mx-1">Send</button>
                <button class="flex-1 bg-blue-500 text-white rounded-lg py-2 mx-1">Convert</button>
            </div>
            <button class="mt-4 text-gray-500" @click="openModal = false">Close</button>
        </div>
    </div>
</template>