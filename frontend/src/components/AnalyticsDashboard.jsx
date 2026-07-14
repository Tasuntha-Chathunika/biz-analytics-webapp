import { useState, useEffect } from 'react';
import { getKPIs, getRegionalSales, getMonthlyTrend, getCategorySales, getTopProducts } from '../api/api';
import RegionChart from './charts/RegionChart';
import TrendChart from './charts/TrendChart';
import CategoryChart from './charts/CategoryChart';
import ProductsChart from './charts/ProductsChart';
import RecentTransactions from './RecentTransactions';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.borderColor = 'rgba(0, 0, 0, 0.04)';
ChartJS.defaults.font.family = "'Inter', sans-serif";

const AnalyticsDashboard = ({ refreshTrigger, userRole }) => {
  const [kpiData, setKpiData] = useState(null);
  const [regionData, setRegionData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartToggle, setChartToggle] = useState('Monthly');

  const isViewer = userRole === 'viewer';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (isViewer) {
          const [kpiRes, trendRes] = await Promise.all([
            getKPIs(),
            getMonthlyTrend()
          ]);
          setKpiData(kpiRes.data);
          setTrendData(trendRes.data);
        } else {
          const [kpiRes, regionRes, trendRes, categoryRes, productsRes] = await Promise.all([
            getKPIs(),
            getRegionalSales(),
            getMonthlyTrend(),
            getCategorySales(),
            getTopProducts()
          ]);
          
          setKpiData(kpiRes.data);
          setRegionData(regionRes.data);
          setTrendData(trendRes.data);
          setCategoryData(categoryRes.data);
          setProductsData(productsRes.data);
        }
      } catch (error) {
        console.error("Error fetching analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger, userRole, isViewer]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading visualizations...</div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return '$' + (value / 1000).toFixed(1) + 'k';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value || 0);
  };

  const formatNumber = (value) => {
    if (!value) return '0';
    return value.toLocaleString();
  };

  // KPI configurations matching the photo design
  const kpis = [
    {
      label: 'Total Revenue',
      value: formatCurrency(kpiData?.totalRevenue),
      change: '+12.5%',
      changeType: 'up',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
    {
      label: 'Transactions',
      value: formatNumber(kpiData?.totalTransactions),
      change: '+4.2%',
      changeType: 'up',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      label: 'Volume Sold',
      value: formatNumber(kpiData?.totalQuantity),
      change: '-1.8%',
      changeType: 'down',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      )
    },
    {
      label: 'Avg. Order Value',
      value: formatCurrency(kpiData?.averageOrderValue),
      change: '+0.5%',
      changeType: 'up',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    }
  ];

  return (
    <div>
      {/* KPI Grid - 4 cards */}
      <div className="kpi-grid">
        {kpis.map((kpi, index) => (
          <div key={index} className={`kpi-card animate-fade-in animate-fade-in-delay-${index + 1}`}>
            <div className="kpi-card-header">
              <div className="kpi-icon-circle">
                {kpi.icon}
              </div>
              <span className={`kpi-change-badge kpi-change-${kpi.changeType}`}>
                {kpi.change}
              </span>
            </div>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row: Global Performance + Device Split */}
      <div className="charts-grid">
        {/* Global Performance Bar Chart */}
        <div className="chart-card animate-fade-in animate-fade-in-delay-2">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Global Performance</div>
              <div className="chart-card-subtitle">Monthly growth comparison by region</div>
            </div>
            <div className="chart-toggle">
              <button
                className={`chart-toggle-btn ${chartToggle === 'Monthly' ? 'active' : ''}`}
                onClick={() => setChartToggle('Monthly')}
              >
                Monthly
              </button>
              <button
                className={`chart-toggle-btn ${chartToggle === 'Yearly' ? 'active' : ''}`}
                onClick={() => setChartToggle('Yearly')}
              >
                Yearly
              </button>
            </div>
          </div>
          <div style={{ height: '320px' }}>
            <TrendChart data={trendData} />
          </div>
        </div>

        {/* Device Split / Region Doughnut */}
        {!isViewer && (
          <div className="chart-card animate-fade-in animate-fade-in-delay-3">
            <div className="chart-card-header">
              <div>
                <div className="chart-card-title">Regional Split</div>
                <div className="chart-card-subtitle">Revenue by region</div>
              </div>
            </div>
            <RegionChart data={regionData} />
          </div>
        )}
      </div>

      {/* Row 2: Top Products + Category (hidden for viewers) */}
      {!isViewer && (
        <div className="charts-grid" style={{ marginBottom: '24px' }}>
          <div className="chart-card animate-fade-in animate-fade-in-delay-3">
            <div className="chart-card-header">
              <div>
                <div className="chart-card-title">Top 5 Selling Products</div>
                <div className="chart-card-subtitle">Revenue by product</div>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <ProductsChart data={productsData} />
            </div>
          </div>

          <div className="chart-card animate-fade-in animate-fade-in-delay-4">
            <div className="chart-card-header">
              <div>
                <div className="chart-card-title">Category Breakdown</div>
                <div className="chart-card-subtitle">Sales by category</div>
              </div>
            </div>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
              <CategoryChart data={categoryData} />
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
};

export default AnalyticsDashboard;
