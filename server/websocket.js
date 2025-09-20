// server/websocket.js
import { WebSocketServer } from "ws";
import fetch from "node-fetch";
import http from "http";

const PORT = process.env.PORT || 4000;

const server = http.createServer();
const wss = new WebSocketServer({ server });

let coins = []; // cached snapshot

// Function to fetch coin data from CoinGecko
async function fetchCoins() {
  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets" +
      "?vs_currency=usd" +
      "&ids=bitcoin,ethereum,solana,tron,tether,usd-coin,sui,binancecoin" +
      "&order=market_cap_desc" +
      "&per_page=10&page=1" +
      "&sparkline=true" + // get chart data
      "&price_change_percentage=1h,24h,7d"; // include % changes

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    coins = data; // cache snapshot

    // broadcast to all connected clients
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

// Fetch immediately on startup
fetchCoins();
// Refresh every 60 seconds
setInterval(fetchCoins, 60_000);

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("📡 Client connected");

  // Send latest snapshot immediately
  if (coins.length > 0) {
    ws.send(JSON.stringify(coins));
  }

  ws.on("close", () => {
    console.log("🔌 Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);
});
