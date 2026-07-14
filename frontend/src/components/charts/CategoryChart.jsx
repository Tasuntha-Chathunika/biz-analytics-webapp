
import { Doughnut } from 'react-chartjs-2';

const CategoryChart = ({ data }) => {
  if (!data || data.length === 0) return <div style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No category data available</div>;

  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        data: data.map(d => parseFloat(d.revenue)),
        backgroundColor: [
          '#1e3a5f',
          '#7fb5d5',
          '#c4dfe6',
          '#f59e0b',
          '#10b981',
          '#8b5cf6'
        ],
        borderWidth: 0,
        hoverOffset: 8,
        spacing: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          usePointStyle: true,
          boxWidth: 8,
          color: '#64748b',
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(26, 35, 50, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) label += ': ';
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

export default CategoryChart;
