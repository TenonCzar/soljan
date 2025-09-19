export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    return navigateTo("/login");
  }

  try {
    const response = await $fetch("/api/verify-token", {
      method: "POST",
      body: { token },
    });
    if (!response.valid) {
      localStorage.removeItem("auth_token");
      return navigateTo("/login");
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    localStorage.removeItem("auth_token");
    return navigateTo("/login");
  }
});
