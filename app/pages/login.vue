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
        <label class="flex flex-col gap-2 rounded"
          >Email:
          <input
            v-model="form.email"
            class="bg-transparent border p-2 outline-none flex-1"
            type="email"
            required
          />
        </label>
      </div>
      <div>
        <label class="flex flex-col gap-2 rounded"
          >Password:
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
        <!-- Updated button text -->
      </button>
      <p v-if="error" class="error">{{ error }}</p>
      <p class="login text-xs mx-auto">
        New To Soljan?
        <RouterLink to="/signup" class="text-lime-500"
          >Create Account</RouterLink
        >
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const form = ref({ email: "", password: "" });
const loading = ref(false);
const error = ref("");
const router = useRouter();

async function handleLogin() {
  loading.value = true;
  error.value = "";
  try {
    const response = await $fetch("/api/login", {
      method: "POST",
      body: form.value,
    });
    if (response.success && response.token) {
      localStorage.setItem("auth_token", response.token);
      router.push("/dashboard");
    }
  } catch (err) {
    error.value = err.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
}

// Periodically check auth status every 5 minutes
let authCheckInterval = null;
async function checkAuthStatus() {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    router.push("/login");
    return;
  }
  try {
    const response = await $fetch("/api/verify-token", {
      method: "POST",
      body: { token },
    });
    if (!response.valid) {
      localStorage.removeItem("auth_token");
      router.push("/login");
    }
  } catch (err) {
    console.error("Auth check failed:", err);
    localStorage.removeItem("auth_token");
    router.push("/login");
  }
}

onMounted(() => {
  checkAuthStatus();
  authCheckInterval = setInterval(checkAuthStatus, 5 * 60 * 1000);
});

onUnmounted(() => {
  // Cleanup interval
  if (authCheckInterval) clearInterval(authCheckInterval);
});
</script>

<style scoped>
.error {
  color: red;
}
</style>
