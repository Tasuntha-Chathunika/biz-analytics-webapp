
import { Doughnut } from 'react-chartjs-2';

const RegionChart = ({ data }) => {
  if (!data || data.length === 0) return <div style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>No data available</div>;

  const total = data.reduce((sum, d) => sum + parseFloat(d.revenue), 0);
  const topPercentage = total > 0 ? Math.round((parseFloat(data[0].revenue) / total) * 100) : 0;

  const colors = ['#1e3a5f', '#7fb5d5', '#c4dfe6', '#f59e0b', '#10b981', '#8b5cf6'];

  const chartData = {
    labels: data.map(d => d.region),
    datasets: [
      {
        data: data.map(d => parseFloat(d.revenue)),
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 0,
        hoverOffset: 6,
        spacing: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        display: false // We'll render custom legend
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
            const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
            label += `: ${percentage}%`;
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="device-split-card">
      <div className="device-split-chart-wrapper">
        <Doughnut data={chartData} options={options} />
        <div className="device-split-center-text">
          <div className="device-split-center-value">{topPercentage}%</div>
          <div className="device-split-center-label">{data[0]?.region || 'TOP'}</div>
        </div>
      </div>
      
      <div className="device-split-legend">
        {data.slice(0, 4).map((item, i) => {
          const pct = total > 0 ? ((parseFloat(item.revenue) / total) * 100).toFixed(1) : 0;
          return (
            <div key={i} className="device-split-legend-item">
              <div className="device-split-legend-left">
                <div className="device-split-legend-dot" style={{ background: colors[i] }}></div>
                <span className="device-split-legend-name">{item.region}</span>
              </div>
              <span className="device-split-legend-value">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegionChart;
