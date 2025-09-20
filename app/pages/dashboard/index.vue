<template>
  <div class="bg-use min-h-screen min-w-full text-white">
    <div class="">
      <AppUseronlyHeader class="" />
      <AppUseronlyActions class="" />
    </div>
  </div>
</template>

<script setup>
import { useRequireAuth } from '~/composables/useRequireAuth';
import { useAuth } from '~/composables/useAuth';
import { onMounted } from 'vue';

useRequireAuth(); // Ensures periodic checks and redirects if invalid
const { user } = useAuth();

// Optionally fetch user data on mount
// onMounted(async () => {
//   const userData = await update();
//   if (userData) {
//     console.log('User data:', userData);
//   }
// });
</script>