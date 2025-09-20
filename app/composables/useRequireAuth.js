// composables/useRequireAuth.js
import { onMounted, onUnmounted } from "vue";
import { useAuth } from "~/composables/useAuth";
import { navigateTo } from "#app";

export function useRequireAuth() {
  const { loadAuth, clearAuth, updateDynamicFields } = useAuth();

  async function checkAuthStatus() {
    const auth = loadAuth();
    if (!auth) {
      navigateTo("/login");
      return;
    }

    try {
      const response = await $fetch("/api/verify-token", {
        method: "POST",
        body: { token: auth.token },
      });
      if (!response.valid) {
        clearAuth();
        navigateTo("/login");
      } else {
        // Optionally update dynamic fields
        await updateDynamicFields();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      clearAuth();
      navigateTo("/login");
    }
  }

  let authCheckInterval = null;

  onMounted(() => {
    checkAuthStatus(); // Initial check
    authCheckInterval = setInterval(checkAuthStatus, 5 * 60 * 1000); // Every 5 minutes
  });

  onUnmounted(() => {
    if (authCheckInterval) clearInterval(authCheckInterval);
  });
}
