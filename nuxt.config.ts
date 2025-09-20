// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
  modules: ["@nuxt/eslint", "@nuxt/icon", "@nuxt/fonts", "nuxt-swiper"],
  runtimeConfig: {
    coingeckoApiKey: process.env.COINGECKO_API_KEY,
  },
});
