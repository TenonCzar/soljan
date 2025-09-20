import { WebSocketServer } from "ws";
import fetch from "node-fetch";
import http from "http";

const PORT = process.env.PORT || 4000;

const server = http.createServer();
const wss = new WebSocketServer({ server });

let coins = [];

// Poll CoinGecko every 15 seconds
async function fetchCoins() {
  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,tron,tether,usd-coin,sui,binancecoin&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h";
    const res = await fetch(url);
    coins = await res.json();

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(coins));
      }
    });
  } catch (err) {
    console.error("CoinGecko fetch error:", err);
  }
}

setInterval(fetchCoins, 15_000); // fetch every 15s
fetchCoins();

wss.on("connection", (ws) => {
  console.log("✅ Client connected");
  // Send latest snapshot immediately
  if (coins.length > 0) {
    ws.send(JSON.stringify(coins));
  }

  ws.on("close", () => {
    console.log("🔌 Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});
