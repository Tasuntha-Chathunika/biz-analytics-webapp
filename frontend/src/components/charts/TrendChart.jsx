import React from 'react';
import { Line } from 'react-chartjs-2';

const TrendChart = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available</div>;

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: data.map(d => parseFloat(d.revenue)),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#1e293b',
        pointBorderColor: '#3b82f6',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: { color: '#94a3b8' }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          callback: function(value) {
            if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return '$' + (value / 1000).toFixed(1) + 'k';
            return '$' + value;
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default TrendChart;
