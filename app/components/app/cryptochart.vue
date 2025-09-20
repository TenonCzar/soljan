<!-- components/AppCryptoChart.vue -->
<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip } from "chart.js";

import { CandlestickController, CandlestickElement, OhlcElement } from "chartjs-chart-financial";
// import "chartjs-chart-financial";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip);

const props = defineProps({
  coinId: { type: String, required: true },
  wsUrl: { type: String, default: "wss://soljan.onrender.com" },
});

// Register all needed
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  CandlestickController,
  CandlestickElement,
  OhlcElement
);


const chartRef = ref(null);
let chartInstance = null;
let socket = null;

const chartType = ref("line");
const prices = ref([]);
const candles = ref([]);

function updateLineChart(newPrices) {
  if (!chartInstance) return;

  chartInstance.data.labels = newPrices.map((_, i) => i);
  chartInstance.data.datasets[0].data = newPrices;

  chartInstance.update("active");
}

function generateCandles(sparkline) {
  const result = [];
  const chunkSize = 4;
  for (let i = 0; i < sparkline.length; i += chunkSize) {
    const slice = sparkline.slice(i, i + chunkSize);
    if (!slice.length) continue;
    result.push({
      x: i,
      o: slice[0],
      h: Math.max(...slice),
      l: Math.min(...slice),
      c: slice[slice.length - 1],
    });
  }
  return result;
}

function renderChart() {
  if (!chartRef.value) return;

  if (!chartInstance) {
    const dataset =
      chartType.value === "line"
        ? [
            {
              label: props.coinId,
              data: prices.value,
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76,175,80,0.1)",
              fill: true,
              tension: 0.3,
              pointRadius: 0,
            },
          ]
        : [
            {
              label: props.coinId,
              data: candles.value,
              type: "candlestick",
              color: { up: "#4caf50", down: "#f44336", unchanged: "#999" },
            },
          ];

    chartInstance = new Chart(chartRef.value, {
      type: chartType.value === "line" ? "line" : "candlestick",
      data: {
        labels:
          chartType.value === "line"
            ? prices.value.map((_, i) => i)
            : candles.value.map((c) => c.x),
        datasets: dataset,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        animation: { duration: 500 },
        scales: { x: { display: chartType.value === "line" }, y: { display: true } },
      },
    });
  } else {
    // Update data without destroying
    if (chartType.value === "line") {
      updateLineChart(prices.value);
    } else {
      chartInstance.data.datasets[0].data = candles.value;
      chartInstance.data.labels = candles.value.map((c) => c.x);
      chartInstance.update();
    }
  }
}

function handleMessage(event) {
  const data = JSON.parse(event.data);
  const coin = data.find((c) => c.id === props.coinId);
  if (!coin) return;

  if (coin.sparkline_in_7d?.price) {
    prices.value = coin.sparkline_in_7d.price;
    candles.value = generateCandles(prices.value);
    renderChart();
  }
}

onMounted(() => {
  socket = new WebSocket(props.wsUrl);
  socket.onmessage = handleMessage;
});

onUnmounted(() => {
  if (socket) socket.close();
  if (chartInstance) chartInstance.destroy();
});

function toggleChartType() {
  chartType.value = chartType.value === "line" ? "candlestick" : "line";
  renderChart();
}
</script>

<template>
  <div class="w-full h-64 relative">
    <button
      class="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded z-10"
      @click="toggleChartType"
    >
      {{ chartType === "line" ? "Candlestick" : "Line" }}
    </button>
    <canvas ref="chartRef"></canvas>
  </div>
</template>
