import React from 'react';
import { Bar } from 'react-chartjs-2';

const ProductsChart = ({ data }) => {
  if (!data || data.length === 0) return <div style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No product data available</div>;

  const chartData = {
    labels: data.map(d => d.product_name),
    datasets: [
      {
        label: 'Revenue',
        data: data.map(d => parseFloat(d.revenue)),
        backgroundColor: '#1e3a5f',
        hoverBackgroundColor: '#264d7a',
        borderRadius: 6,
        borderWidth: 0,
        barThickness: 18
      }
    ]
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(26, 35, 50, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderRadius: 8,
        callbacks: {
          label: function(context) {
            let label = 'Revenue: ';
            if (context.raw !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.raw);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.04)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          callback: function(value) {
            if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return '$' + (value / 1000).toFixed(1) + 'k';
            return '$' + value;
          }
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
            weight: '500'
          }
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default ProductsChart;
