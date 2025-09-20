import { WebSocketServer } from "ws";
import fetch from "node-fetch";
import http from "http";

const PORT = process.env.PORT || 4000;

const server = http.createServer();
const wss = new WebSocketServer({ server });

let snapshot = {};

// ✅ Fetch detailed coin info (with 24h % change, market cap, volume)
async function fetchCoins() {
  try {
    const url =
      "https://api.coincap.io/v2/assets?ids=bitcoin,ethereum,solana,tron,tether,usd-coin,sui,binancecoin";
    const res = await fetch(url);
    const { data } = await res.json();

    // Map only the fields you care about
    snapshot = data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      priceUsd: parseFloat(coin.priceUsd),
      marketCapUsd: parseFloat(coin.marketCapUsd),
      volumeUsd24Hr: parseFloat(coin.volumeUsd24Hr),
      changePercent24Hr: parseFloat(coin.changePercent24Hr),
      supply: parseFloat(coin.supply),
    }));

    broadcast(snapshot);
  } catch (err) {
    console.error("CoinCap fetch error:", err);
  }
}

// ✅ Fetch chart data (candlesticks) for one coin
async function fetchChart(coin = "bitcoin", interval = "m15") {
  try {
    const url = `https://api.coincap.io/v2/candles?exchange=binance&interval=${interval}&baseId=${coin}&quoteId=tether`;
    const res = await fetch(url);
    const { data } = await res.json();
    return data; // [{period, open, high, low, close, volume}]
  } catch (err) {
    console.error("Chart fetch error:", err);
    return [];
  }
}

// ✅ Broadcast to all connected clients
function broadcast(msg) {
  const str = JSON.stringify(msg);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(str);
    }
  });
}

// ✅ Keep snapshot refreshed every 15s
setInterval(fetchCoins, 15_000);
fetchCoins();

// ✅ WebSocket price stream (real-time ticker)
const priceSocket = new WebSocket(
  "wss://ws.coincap.io/prices?assets=bitcoin,ethereum,solana,tron,tether,usd-coin,sui,binancecoin"
);

priceSocket.onmessage = (msg) => {
  const updates = JSON.parse(msg.data);

  // Merge updates into snapshot
  snapshot = snapshot.map((coin) => {
    if (updates[coin.id]) {
      coin.priceUsd = parseFloat(updates[coin.id]);
    }
    return coin;
  });

  broadcast(snapshot);
};

wss.on("connection", async (ws) => {
  console.log("✅ Client connected");

  // Send latest snapshot immediately
  if (snapshot.length > 0) {
    ws.send(JSON.stringify(snapshot));
  }

  // Example: if client requests chart
  ws.on("message", async (msg) => {
    try {
      const { type, coin, interval } = JSON.parse(msg);
      if (type === "chart") {
        const chart = await fetchChart(coin, interval);
        ws.send(JSON.stringify({ type: "chart", coin, chart }));
      }
    } catch (err) {
      console.error("Message error:", err);
    }
  });

  ws.on("close", () => {
    console.log("🔌 Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});
