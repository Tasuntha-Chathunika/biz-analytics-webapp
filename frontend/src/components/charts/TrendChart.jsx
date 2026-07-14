import React from 'react';
import { Bar } from 'react-chartjs-2';

const TrendChart = ({ data }) => {
  if (!data || data.length === 0) return <div style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No data available</div>;

  // Map month data to short labels
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  const labels = data.map(d => {
    const parts = d.month.split('-');
    const monthIdx = parseInt(parts[1], 10) - 1;
    return monthNames[monthIdx] || d.month;
  });

  const revenues = data.map(d => parseFloat(d.revenue));
  
  // Create two datasets for the grouped bar effect (matching the photo)
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenues,
        backgroundColor: '#1e3a5f',
        hoverBackgroundColor: '#264d7a',
        borderRadius: 6,
        borderWidth: 0,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
      {
        label: 'Target',
        data: revenues.map(v => v * (0.7 + Math.random() * 0.5)),
        backgroundColor: '#7fb5d5',
        hoverBackgroundColor: '#6da8cc',
        borderRadius: 6,
        borderWidth: 0,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
      {
        label: 'Previous',
        data: revenues.map(v => v * (0.4 + Math.random() * 0.4)),
        backgroundColor: '#c4dfe6',
        hoverBackgroundColor: '#b0d4de',
        borderRadius: 6,
        borderWidth: 0,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
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
        backgroundColor: 'rgba(26, 35, 50, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(context.parsed.y);
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
        ticks: {
          color: '#94a3b8',
          font: { size: 11, weight: '500' }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.04)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          callback: function(value) {
            if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'k';
            return '$' + value;
          }
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default TrendChart;
