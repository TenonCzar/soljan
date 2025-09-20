// server/websocket.js
import { WebSocketServer } from "ws";
import fetch from "node-fetch";
import http from "http";

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("✅ WebSocket + HTTP server is running\n");
});

const wss = new WebSocketServer({ server });

let coins = [];

// Fetch from CoinGecko every 60s
async function fetchCoins() {
  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets" +
      "?vs_currency=usd" +
      "&ids=bitcoin,ethereum,solana,tron,tether,usd-coin,sui,binancecoin" +
      "&order=market_cap_desc" +
      "&per_page=10&page=1" +
      "&sparkline=true" +
      "&price_change_percentage=1h,24h,7d";

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    coins = data;

    // broadcast snapshot
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(coins));
      }
    });

    console.log("✅ Updated coin data from CoinGecko");
  } catch (err) {
    console.error("❌ CoinGecko fetch error:", err.message);
  }
}

fetchCoins();
setInterval(fetchCoins, 60_000);

wss.on("connection", (ws) => {
  console.log("📡 Client connected");
  if (coins.length > 0) ws.send(JSON.stringify(coins));
  ws.on("close", () => console.log("🔌 Client disconnected"));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 WebSocket + HTTP server running on port ${PORT}`);
});
