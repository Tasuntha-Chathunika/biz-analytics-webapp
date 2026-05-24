import React, { useState, useEffect } from 'react';
import { getKPIs, getRegionalSales, getMonthlyTrend } from '../api/api';
import RegionChart from './charts/RegionChart';
import TrendChart from './charts/TrendChart';

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
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
ChartJS.defaults.font.family = "'Inter', sans-serif";

const AnalyticsDashboard = () => {
  const [kpiData, setKpiData] = useState(null);
  const [regionData, setRegionData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [kpiRes, regionRes, trendRes] = await Promise.all([
          getKPIs(),
          getRegionalSales(),
          getMonthlyTrend()
        ]);
        
        setKpiData(kpiRes.data);
        setRegionData(regionRes.data);
        setTrendData(trendRes.data);
      } catch (error) {
        console.error("Error fetching analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ color: 'var(--accent-color)', fontSize: '1.2rem' }}>Loading visualizations...</div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value || 0);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Corporate Intelligence Overview</h2>
        <button className="btn" style={{ background: 'var(--card-bg)', color: 'white', border: '1px solid var(--card-border)' }}>
          Export Report
        </button>
      </div>

      <div className="kpi-grid">
        <div className="glass-card">
          <div className="kpi-label">Total Revenue</div>
          <div className="kpi-value" style={{ color: 'var(--success-color)' }}>
            {formatCurrency(kpiData?.totalRevenue)}
          </div>
        </div>
        <div className="glass-card">
          <div className="kpi-label">Total Transactions</div>
          <div className="kpi-value">{kpiData?.totalTransactions?.toLocaleString()}</div>
        </div>
        <div className="glass-card">
          <div className="kpi-label">Average Order Value</div>
          <div className="kpi-value">{formatCurrency(kpiData?.averageOrderValue)}</div>
        </div>
      </div>

      <div className="grid-dashboard">
        <div className="glass-card col-span-8">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '1rem' }}>Revenue Trend (Monthly)</h3>
          <div style={{ height: '350px' }}>
            <TrendChart data={trendData} />
          </div>
        </div>
        
        <div className="glass-card col-span-4">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '1rem' }}>Regional Distribution</h3>
          <div style={{ height: '350px', display: 'flex', justifyContent: 'center' }}>
            <RegionChart data={regionData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
