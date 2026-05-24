import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const RegionChart = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available</div>;

  const chartData = {
    labels: data.map(d => d.region),
    datasets: [
      {
        data: data.map(d => parseFloat(d.revenue)),
        backgroundColor: [
          '#3b82f6', // blue
          '#8b5cf6', // purple
          '#10b981', // emerald
          '#f59e0b', // amber
          '#ef4444', // red
          '#6366f1'  // indigo
        ],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          boxWidth: 8,
          color: '#94a3b8'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.raw);
            }
            return label;
          }
        }
      }
    }
  };

  return <Doughnut data={chartData} options={options} />;
};

export default RegionChart;
