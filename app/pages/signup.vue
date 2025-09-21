<template>
  <div
    class="min-w-screen min-h-screen bg-use text-white p-8 flex flex-col items-center"
  >
    <h1 class="roma text-2xl mb-20">Sign Up</h1>
    <form
      class="border p-4 rounded place-self-center flex flex-col gap-3 w-full max-w-[600px]"
      @submit.prevent="handleSignup"
    >
      <div>
        <label class="flex flex-col gap-2 rounded"
          >Full Name:
          <input
            v-model="form.fullName"
            class="bg-transparent border p-2 outline-none flex-1"
            type="text"
            required
          />
        </label>
      </div>
      <div>
        <label class="flex flex-col gap-2 rounded"
          >Username:
          <input
            v-model="form.userName"
            class="bg-transparent border p-2 outline-none flex-1"
            type="text"
            required
          />
        </label>
      </div>
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
      <p v-if="error" class="error">{{ error }}</p>
      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-500 text-white p-2 rounded mt-3 cursor-pointer"
      >
        Sign Up
      </button>
      <p class="login text-xs mx-auto">
        Already Have An Account?
        <NuxtLink to="/login" class="text-lime-500">Login</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup>
const form = ref({ fullName: "", userName: "", email: "", password: "" });
const loading = ref(false);
const error = ref("");

async function handleSignup() {
  loading.value = true;
  error.value = "";
  try {
    const response = await $fetch("/api/signup", {
      method: "POST",
      body: form.value,
    });
    if (response.success) {
      // Redirect to dashboard or login
      navigateTo("/login");
    }
  } catch (err) {
    error.value = err.data?.message || "Signup failed";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
}
.error {
  color: red;
}
</style>
