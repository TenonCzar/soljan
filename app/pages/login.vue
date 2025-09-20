<template>
  <div
    class="min-w-screen min-h-screen bg-use text-white p-8 flex flex-col items-center"
  >
    <h1 class="roma text-2xl mb-20">Login</h1>
    <form
      class="border p-4 rounded place-self-center flex flex-col gap-3 w-full max-w-[600px]"
      @submit.prevent="handleLogin"
    >
      <div>
        <label class="flex flex-col gap-2 rounded">
          Email:
          <input
            v-model="form.email"
            class="bg-transparent border p-2 outline-none flex-1"
            type="email"
            required
          />
        </label>
      </div>
      <div>
        <label class="flex flex-col gap-2 rounded">
          Password:
          <input
            v-model="form.password"
            class="bg-transparent border p-2 outline-none flex-1"
            type="password"
            required
          />
        </label>
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-500 text-white p-2 rounded mt-3 cursor-pointer"
      >
        Login
      </button>
      <p v-if="error" class="error">{{ error }}</p>
      <p class="login text-xs mx-auto">
        New To Soljan?
        <NuxtLink to="/signup" class="text-lime-500">Create Account</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";

const form = ref({ email: "", password: "" });
const loading = ref(false);
const error = ref("");
const { setAuth, updateDynamicFields } = useAuth();

async function handleLogin() {
  loading.value = true;
  error.value = "";
  try {
    const response = await $fetch("/api/login", {
      method: "POST",
      body: form.value,
    });
    if (response.success && response.token) {
      // Fetch user data to get static fields
      const userData = await $fetch("/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ₦{response.token}`,
        },
      });
      setAuth(response.token, {
        id: userData.user.id,
        email: userData.user.email,
        name: userData.user.name,
        username: userData.user.username,
        account: userData.user.account,
        addresses: userData.user.addresses,
        wallet: userData.user.wallet,
        last_checkin: userData.user.last_checkin,
        checkin: userData.user.checkin,
        // Dynamic fields will be updated separately
        balance: userData.user.balance,
        addresses: userData.user.addresses.map((addr) => ({
          ...addr,
          ngnbalance: addr.ngnbalance,
          coinbal: addr.coinbal,
        })),
      });
      navigateTo("/dashboard");
    }
  } catch (err) {
    error.value = err.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
