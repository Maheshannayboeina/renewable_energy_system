// ...existing code...
import React, { useRef, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function EnergyChart({ energyData = [] }) {
  const chartRef = useRef(null);

  // Sort by timestamp ascending and map to usable arrays
  const sorted = useMemo(
    () => [...(energyData || [])].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
    [energyData]
  );

  const labels = useMemo(
    () =>
      sorted.map((d) =>
        d.timestamp
          ? new Date(d.timestamp).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '—'
      ),
    [sorted]
  );

  const generated = useMemo(() => sorted.map((d) => Number(d.generated_kwh || 0)), [sorted]);
  const consumed = useMemo(() => sorted.map((d) => Number(d.consumed_kwh || 0)), [sorted]);

  // Create simple vertical gradients (uses an offscreen canvas so it works before render)
  const genGradient = useMemo(() => {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 200);
    g.addColorStop(0, 'rgba(75,192,192,0.45)');
    g.addColorStop(1, 'rgba(75,192,192,0.05)');
    return g;
  }, []);

  const conGradient = useMemo(() => {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 200);
    g.addColorStop(0, 'rgba(255,99,132,0.40)');
    g.addColorStop(1, 'rgba(255,99,132,0.05)');
    return g;
  }, []);

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Generated (kWh)',
          data: generated,
          borderColor: 'rgb(75,192,192)',
          backgroundColor: genGradient,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 6,
          borderWidth: 2,
        },
        {
          label: 'Consumed (kWh)',
          data: consumed,
          borderColor: 'rgb(255,99,132)',
          backgroundColor: conGradient,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 6,
          borderDash: [3, 4],
          borderWidth: 2,
        },
      ],
    }),
    [labels, generated, consumed, genGradient, conGradient]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: { boxWidth: 12, padding: 12 },
        },
        title: {
          display: true,
          text: 'Energy Monitoring — Generation vs Consumption',
          font: { size: 16, weight: '600' },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const value = context.parsed.y ?? 0;
              return `${context.dataset.label}: ${Number(value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} kWh`;
            },
            afterBody: function (ctx) {
              // show net difference in tooltip (generated - consumed) for same index
              try {
                const idx = ctx[0].dataIndex;
                const g = generated[idx] ?? 0;
                const c = consumed[idx] ?? 0;
                const net = g - c;
                return `Net: ${net >= 0 ? '+' : ''}${net.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} kWh`;
              } catch {
                return '';
              }
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (v) {
              return `${v}`;
            },
          },
          grid: { color: 'rgba(0,0,0,0.06)' },
        },
      },
    }),
    [generated, consumed]
  );

  return (
    <div style={{ height: '100%', width: '100%', minHeight: 260 }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}

export default EnergyChart;
// ...existing code...