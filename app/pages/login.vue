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
          Username:
          <input
            v-model="form.username"
            class="bg-transparent border p-2 outline-none flex-1 lowercase"
            type="text"
            required
          />
        </label>
      </div>
      <div>
        <label class="flex flex-col gap-2 rounded relative">
          Password:
          <input
            v-model="form.password"
            class="bg-transparent border p-2 outline-none flex-1"
            type="password"
            required
          />
          <Icon name="mdi:eye-off-outline" class="absolute right-4 top-11 cursor-pointer" @click="togglePasswordVisibility" />
        </label>
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-500 text-white p-2 rounded mt-3 cursor-pointer"
      >
        {{  loading ? "Logging in..." : "Login" }}
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

const form = ref({ username: "", password: "" });
const loading = ref(false);
const error = ref("");
const { setAuth, updateDynamicFields } = useAuth();

const togglePasswordVisibility = () => {
  const passwordInput = document.querySelector('input[type="password"]');
  if (passwordInput) {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  }
};

async function handleLogin() {
  loading.value = true;
  error.value = "";
  try {
    const response = await $fetch("/api/login", {
      method: "POST",
      body: { username: form.value.username.toLowerCase().trim(), password: form.value.password },
    });
    if (response.success && response.token) {
      const userData = await $fetch("/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${response.token}`,
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
        addressesData: userData.user.addresses.map((addr) => ({
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
