import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { kpiData as mockKpiData, salesData, weeklyData, categoryData as mockCategoryData, regionData as mockRegionData, topProducts as mockTopProducts, transactions as mockTransactions } from "../mockData";
import { getKPIs, getMonthlyTrend, getRegionalSales, getCategorySales, getTopProducts, getRecentTransactions } from "../api/api";

/* ── KPI card config (values filled dynamically) ──────── */
const kpiCardConfig = [
  {
    label: "Total Revenue",
    key: "totalRevenue",
    format: (v) => `$${Number(v).toLocaleString()}`,
    trend: "up",
    raw: mockKpiData.totalRevenue.change,
    sub: "vs last month",
    cardClass: "card-violet",
    iconBg: "linear-gradient(135deg, #6366f1, #818cf8)",
    iconGlow: "rgba(99,102,241,0.5)",
    accentColor: "#818cf8",
    textGrad: "grad-violet",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "Total Orders",
    key: "totalTransactions",
    format: (v) => Number(v).toLocaleString(),
    trend: "up",
    raw: mockKpiData.totalOrders.change,
    sub: "vs last month",
    cardClass: "card-emerald",
    iconBg: "linear-gradient(135deg, #10b981, #34d399)",
    iconGlow: "rgba(16,185,129,0.5)",
    accentColor: "#34d399",
    textGrad: "grad-emerald",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    label: "Avg Order Value",
    key: "averageOrderValue",
    format: (v) => `$${Number(v).toFixed(2)}`,
    trend: "up",
    raw: mockKpiData.aov.change,
    sub: "vs last month",
    cardClass: "card-sky",
    iconBg: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    iconGlow: "rgba(56,189,248,0.5)",
    accentColor: "#38bdf8",
    textGrad: "grad-sky",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    label: "Total Quantity",
    key: "totalQuantity",
    format: (v) => Number(v).toLocaleString(),
    trend: "up",
    raw: Math.abs(mockKpiData.activeCustomers.change),
    sub: "units sold",
    cardClass: "card-rose",
    iconBg: "linear-gradient(135deg, #f43f5e, #fb7185)",
    iconGlow: "rgba(244,63,94,0.5)",
    accentColor: "#fb7185",
    textGrad: "grad-rose",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

/* ── Custom tooltip ───────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl px-4 py-3 animate-fade-up" style={{ background: "rgba(12,9,28,0.97)", border: "1px solid rgba(139,92,246,0.25)", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
      <p className="text-xs font-semibold mb-2.5 uppercase tracking-wider" style={{ color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2.5 text-sm mb-1">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
          <span className="text-slate-400">{p.name}</span>
          <span className="font-bold text-white ml-auto pl-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {p.name?.toLowerCase().includes("revenue") || p.name?.toLowerCase().includes("target")
              ? `$${Number(p.value).toLocaleString()}`
              : Number(p.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const statusConfig = {
  Completed: { color: "#34d399", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", dot: "#10b981" },
  Pending:   { color: "#fbbf24", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", dot: "#f59e0b" },
  Processing:{ color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.25)", dot: "#38bdf8" },
  Refunded:  { color: "#fb7185", bg: "rgba(244,63,94,0.1)",  border: "rgba(244,63,94,0.25)",  dot: "#f43f5e" },
};

/* ── Sparkline mini chart (SVG path from data) ─────────── */
function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 80; const h = 28;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  const area = `M0,${h} L${points.split(" ").map(p => p).join(" L")} L${w},${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${color.replace("#", "")})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AnalyticsDashboard({ refreshTrigger, userRole }) {
  const [trendView, setTrendView] = useState("monthly");
  const [kpiLive, setKpiLive] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [regionData, setRegionData] = useState(mockRegionData);
  const [categoryData, setCategoryData] = useState(mockCategoryData);
  const [topProductsData, setTopProductsData] = useState(mockTopProducts);
  const [transactions, setTransactions] = useState(mockTransactions);

  // Fetch real data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, trendRes, recentRes] = await Promise.all([
          getKPIs(),
          getMonthlyTrend(),
          getRecentTransactions(),
        ]);
        if (kpiRes.data) setKpiLive(kpiRes.data);
        if (trendRes.data?.length > 0) {
          setMonthlyData(trendRes.data.map(r => ({
            month: r.month,
            revenue: Number(r.revenue),
          })));
        }
        if (recentRes.data?.length > 0) {
          setTransactions(recentRes.data.map((r, i) => ({
            id: `TX-${String(i + 9012)}`,
            date: r.transaction_date?.substring(0, 10) || '',
            customer: r.region || 'Unknown',
            product: r.product_name || r.category || '-',
            category: r.category || '-',
            unitPrice: Number(r.revenue) / (r.quantity_sold || 1),
            quantity: r.quantity_sold || 1,
            total: Number(r.revenue),
            status: Number(r.revenue) >= 500 ? 'Completed' : 'Pending',
          })));
        }
      } catch (err) {
        console.warn('Failed to fetch KPIs/trends — using mock data:', err.message);
      }

      // Fetch role-restricted data (admin/manager only)
      if (userRole === 'admin' || userRole === 'manager') {
        try {
          const [regRes, catRes, prodRes] = await Promise.all([
            getRegionalSales(),
            getCategorySales(),
            getTopProducts(),
          ]);
          if (regRes.data?.length > 0) setRegionData(regRes.data.map(r => ({ region: r.region, revenue: Number(r.revenue) })));
          if (catRes.data?.length > 0) {
            const total = catRes.data.reduce((s, c) => s + Number(c.revenue), 0);
            const colors = ["#6366f1", "#10b981", "#8b5cf6", "#38bdf8", "#f59e0b", "#f43f5e", "#ec4899"];
            setCategoryData(catRes.data.map((c, i) => ({
              name: c.category,
              value: total > 0 ? Math.round((Number(c.revenue) / total) * 100) : 0,
              color: colors[i % colors.length],
            })));
          }
          if (prodRes.data?.length > 0) setTopProductsData(prodRes.data.map(p => ({
            name: p.product_name,
            units: Number(p.quantity),
            revenue: Number(p.revenue),
          })));
        } catch (err) {
          console.warn('Failed to fetch restricted analytics — using mock data:', err.message);
        }
      }
    };
    fetchData();
  }, [refreshTrigger, userRole]);

  // Build KPI cards with live or mock values
  const kpiCards = kpiCardConfig.map(cfg => ({
    ...cfg,
    value: kpiLive ? cfg.format(kpiLive[cfg.key] || 0) : cfg.format(0),
  }));

  const chartData = trendView === "monthly" ? (monthlyData || salesData) : weeklyData;
  const xKey = trendView === "monthly" ? "month" : "day";

  const sparkData = [42, 55, 48, 71, 63, 89, 94, 112, 98, 128, 145, 163];

  return (
    <div className="space-y-5 pb-6 animate-fade-up">

      {/* ── KPI Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => (
          <div
            key={kpi.label}
            className={`${kpi.cardClass} card-hover rounded-2xl p-5 relative overflow-hidden`}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            {/* Background glow blob */}
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
              style={{ background: kpi.accentColor }} />

            <div className="flex items-start justify-between mb-4">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: kpi.iconBg, boxShadow: `0 0 20px ${kpi.iconGlow}` }}
              >
                {kpi.icon}
              </div>
              <div
                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: kpi.trend === "up" ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)",
                  color: kpi.trend === "up" ? "#34d399" : "#fb7185",
                  border: `1px solid ${kpi.trend === "up" ? "rgba(16,185,129,0.25)" : "rgba(244,63,94,0.25)"}`,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <span style={{ fontSize: 9 }}>{kpi.trend === "up" ? "▲" : "▼"}</span>
                {kpi.raw}%
              </div>
            </div>

            <p className={`text-2xl font-extrabold mb-0.5 ${kpi.textGrad}`}>{kpi.value}</p>
            <p className="text-xs font-medium text-slate-500">{kpi.label}</p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-xs" style={{ color: "#334155" }}>{kpi.sub}</p>
              <Sparkline data={sparkData.slice(-8)} color={kpi.accentColor} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Trend Chart + Donut ────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Area chart */}
        <div className="xl:col-span-2 glass card-hover rounded-2xl p-6" style={{ border: "1px solid rgba(139,92,246,0.12)" }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-bold text-white text-sm">Revenue & Target</h3>
              <p className="text-xs mt-0.5" style={{ color: "#475569" }}>Performance over time · all amounts in USD</p>
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {(["monthly", "weekly"]).map((v) => (
                <button
                  key={v}
                  onClick={() => setTrendView(v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: trendView === v ? "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))" : "transparent",
                    color: trendView === v ? "#a5b4fc" : "#475569",
                    border: trendView === v ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
                    boxShadow: trendView === v ? "0 0 10px rgba(99,102,241,0.2)" : "none",
                  }}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="areaRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="areaTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <filter id="glow-line">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey={xKey} tick={{ fill: "#475569", fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              {trendView === "monthly" && (
                <Area type="monotone" dataKey="target" name="Target" stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 4" fill="url(#areaTarget)" dot={false} />
              )}
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#areaRev)" dot={false} activeDot={{ r: 6, fill: "#818cf8", stroke: "#6366f1", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category donut */}
        <div className="glass card-hover rounded-2xl p-6" style={{ border: "1px solid rgba(139,92,246,0.12)" }}>
          <h3 className="font-bold text-white text-sm mb-0.5">Sales by Category</h3>
          <p className="text-xs mb-4" style={{ color: "#475569" }}>Revenue distribution</p>

          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <defs>
                {categoryData.map((c, i) => (
                  <radialGradient key={i} id={`pieGrad-${i}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={c.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={c.color} stopOpacity={0.7} />
                  </radialGradient>
                ))}
              </defs>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={`url(#pieGrad-${i})`} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [`${v}%`, ""]}
                contentStyle={{ background: "rgba(12,9,28,0.97)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2 mt-1">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color, boxShadow: `0 0 6px ${cat.color}` }} />
                <span className="text-xs text-slate-400 flex-1">{cat.name}</span>
                <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${cat.value}%`, background: cat.color }} />
                </div>
                <span className="text-xs font-bold w-7 text-right" style={{ color: cat.color, fontFamily: "'JetBrains Mono', monospace" }}>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Region + Top Products ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Region rounded bar chart */}
        <div className="glass card-hover rounded-2xl p-6" style={{ border: "1px solid rgba(139,92,246,0.12)" }}>
          <h3 className="font-bold text-white text-sm mb-0.5">Revenue by Region</h3>
          <p className="text-xs mb-5" style={{ color: "#475569" }}>Geographic performance breakdown</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 12, left: 4, bottom: 0 }}>
              <defs>
                {regionData.map((_, i) => (
                  <linearGradient key={i} id={`regGrad-${i}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={["#6366f1","#10b981","#8b5cf6","#38bdf8","#f59e0b"][i]} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={["#818cf8","#34d399","#a78bfa","#7dd3fc","#fbbf24"][i]} stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#475569", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="region" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={98} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" radius={[0, 8, 8, 0]}>
                {regionData.map((_, i) => (
                  <Cell key={i} fill={`url(#regGrad-${i})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="glass card-hover rounded-2xl p-6" style={{ border: "1px solid rgba(139,92,246,0.12)" }}>
          <h3 className="font-bold text-white text-sm mb-0.5">Top Products</h3>
          <p className="text-xs mb-5" style={{ color: "#475569" }}>By revenue this period</p>
          <div className="space-y-4">
            {topProductsData.map((p, i) => {
              const pct = Math.round((p.revenue / topProductsData[0].revenue) * 100);
              const palette = [
                { grad: "linear-gradient(to right, #6366f1, #818cf8)", color: "#818cf8", bg: "rgba(99,102,241,0.12)" },
                { grad: "linear-gradient(to right, #8b5cf6, #a78bfa)", color: "#a78bfa", bg: "rgba(139,92,246,0.12)" },
                { grad: "linear-gradient(to right, #10b981, #34d399)", color: "#34d399", bg: "rgba(16,185,129,0.12)" },
                { grad: "linear-gradient(to right, #0ea5e9, #38bdf8)", color: "#38bdf8", bg: "rgba(56,189,248,0.12)" },
                { grad: "linear-gradient(to right, #f59e0b, #fbbf24)", color: "#fbbf24", bg: "rgba(245,158,11,0.12)" },
              ][i];
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black"
                        style={{ background: palette.bg, color: palette.color, border: `1px solid ${palette.color}30` }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-200 truncate max-w-[150px]">{p.name}</p>
                        <p className="text-xs" style={{ color: "#475569" }}>{p.units} units</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: palette.color, fontFamily: "'JetBrains Mono', monospace" }}>
                      ${p.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: palette.grad, boxShadow: `0 0 8px ${palette.color}60` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Recent Transactions ────────────────────────────── */}
      <div className="glass rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.12)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <h3 className="font-bold text-white text-sm">Recent Transactions</h3>
            <p className="text-xs mt-0.5" style={{ color: "#475569" }}>Latest 5 sales records</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "#475569" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              Live data
            </span>
            <a
              href="/dashboard/ledger"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              View All →
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {["Transaction ID", "Customer", "Product", "Amount", "Date", "Status"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-widest whitespace-nowrap" style={{ color: "#334155" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((tx, i) => {
                const s = statusConfig[tx.status] ?? statusConfig.Pending;
                return (
                  <tr
                    key={tx.id}
                    className="group transition-colors"
                    style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold" style={{ color: "#818cf8", fontFamily: "'JetBrains Mono', monospace" }}>{tx.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${"#6366f1,#8b5cf6,#10b981,#38bdf8,#f59e0b".split(",")[i % 5]}, ${"#818cf8,#a78bfa,#34d399,#7dd3fc,#fbbf24".split(",")[i % 5]})` }}
                        >
                          {tx.customer.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-300 font-medium whitespace-nowrap">{tx.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-[140px] truncate">{tx.product}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>${tx.total.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{tx.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
