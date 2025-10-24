// frontend/src/components/EnergyChart.js

import React from 'react';
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
} from 'chart.js';

// We need to register the components we are going to use with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function EnergyChart({ energyData }) {
    // Chart.js requires data to be in a specific format
    const chartData = {
        // Labels for the X-axis (the timestamps)
        labels: energyData.map(d => new Date(d.timestamp).toLocaleDateString()).reverse(),
        datasets: [
            {
                label: 'Energy Generated (kWh)',
                // Data for the Y-axis
                data: energyData.map(d => d.generated_kwh).reverse(),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.1,
            },
            {
                label: 'Energy Consumed (kWh)',
                // Data for the Y-axis
                data: energyData.map(d => d.consumed_kwh).reverse(),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Energy Monitoring: Generation vs. Consumption',
                font: {
                    size: 18
                }
            },
        },
    };

    return <Line options={options} data={chartData} />;
}

export default EnergyChart;