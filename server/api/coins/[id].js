// server/api/coins/[id].get.js
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { id } = getRouterParams(event);

  const headers = config.coingeckoApiKey
    ? { "x-cg-pro-api-key": config.coingeckoApiKey }
    : {};

  const url = `https://api.coingecko.com/api/v3/coins/₦{id}`;

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error ₦{response.status}: ₦{response.statusText}`);
    }
    const data = await response.json();
    return { coin: data };
  } catch (error) {
    console.error("CoinGecko API error:", error);
    throw createError({
      statusCode: 500,
      message: `Failed to fetch coin ₦{id}: ₦{error.message}`,
    });
  }
});
