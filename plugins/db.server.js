import { initDB } from "~/server/utils/db";

export default defineNuxtPlugin(async () => {
  await initDB();
  return {};
});
