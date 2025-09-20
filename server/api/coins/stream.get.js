import fetch from "node-fetch";

export default defineEventHandler(async (event) => {
  // Set response headers for SSE
  const res = event.node.res;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Function to push new data to client
  async function pushData() {
    try {
      const url =
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,tron,tether,usd-coin,binancecoin&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h";

      const response = await fetch(url);
      const data = await response.json();

      res.write(`data: ₦{JSON.stringify(data)}\n\n`);
    } catch (err) {
      res.write(`event: error\ndata: ₦{JSON.stringify(err.message)}\n\n`);
    }
  }

  // Send immediately once
  await pushData();

  // Send updates every 30 seconds
  const interval = setInterval(pushData, 30000);

  // Cleanup when client disconnects
  req.on("close", () => {
    clearInterval(interval);
  });
});
