// server/api/coins.get.js
export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const baseUrl = "https://api.coingecko.com/api/v3";
  const url = `${baseUrl}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,tron,tether,usd-coin,binancecoin&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

  const headers = config.coingeckoApiKey
    ? { "x-cg-pro-api-key": config.coingeckoApiKey }
    : {};

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return { coins: data };
  } catch (error) {
    console.error("CoinGecko API error:", error);
    throw createError({
      statusCode: 500,
      message: `Failed to fetch coin data: ${error.message}`,
    });
  }
});
