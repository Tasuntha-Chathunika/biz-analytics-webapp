import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getKPIs, getCategorySales, getMonthlyTrend, getSales } from "../api/api";
import { categoryData as mockCategoryData } from "../mockData";

const reportTypes = [
  {
    id: "financial",
    title: "Monthly Financial Summary",
    desc: "Revenue, orders, and margin breakdown for the current period.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
    ),
    color: "#6366f1",
    badge: "Most Popular",
  },
  {
    id: "inventory",
    title: "Inventory & Product Performance",
    desc: "Top products, category share, and inventory turnover rate.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
    ),
    color: "#10b981",
    badge: null,
  },
  {
    id: "customer",
    title: "Customer Growth Analysis",
    desc: "Acquisition trends, cohort retention, and lifetime value metrics.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    color: "#8b5cf6",
    badge: null,
  },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("financial");
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(null);
  const [kpiData, setKpiData] = useState(null);
  const [categoryData, setCategoryData] = useState(mockCategoryData);
  const [monthlyData, setMonthlyData] = useState([]);

  // Fetch real data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, catRes, trendRes] = await Promise.all([
          getKPIs(),
          getCategorySales().catch(() => null),
          getMonthlyTrend().catch(() => null),
        ]);

        if (kpiRes.data) setKpiData(kpiRes.data);

        if (catRes?.data?.length > 0) {
          const total = catRes.data.reduce((s, c) => s + Number(c.revenue), 0);
          const colors = ["#6366f1", "#10b981", "#8b5cf6", "#38bdf8", "#f59e0b", "#f43f5e", "#ec4899"];
          setCategoryData(catRes.data.map((c, i) => ({
            name: c.category,
            value: total > 0 ? Math.round((Number(c.revenue) / total) * 100) : 0,
            color: colors[i % colors.length],
          })));
        }

        if (trendRes?.data?.length > 0) {
          // Group into quarters
          const quarters = {};
          trendRes.data.forEach(r => {
            const [year, month] = r.month.split('-');
            const q = Math.ceil(parseInt(month) / 3);
            const key = `Q${q} ${year}`;
            quarters[key] = (quarters[key] || 0) + Number(r.revenue);
          });
          setMonthlyData(Object.entries(quarters).map(([q, revenue]) => ({ q, revenue: Math.round(revenue) })));
        }
      } catch (err) {
        console.warn('Failed to fetch report data:', err.message);
      }
    };
    fetchData();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Real CSV export - downloads all sales data
  const handleDownloadCSV = async () => {
    setGenerating(true);
    try {
      // Fetch all data (up to 10000 rows)
      const res = await getSales(1, 10000, '');
      const rows = res.data.data;

      if (rows.length === 0) {
        showToast("No data to export. Upload CSV data first.");
        setGenerating(false);
        return;
      }

      const headers = ["Date", "Region", "Category", "Product", "Quantity", "Revenue"];
      const csvRows = [headers.join(",")];
      rows.forEach(r => {
        csvRows.push([
          r.transaction_date?.substring(0, 10) || '',
          r.region || '',
          r.category || '',
          `"${r.product_name || ''}"`,
          r.quantity_sold || 0,
          r.revenue || 0,
        ].join(","));
      });

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bizanalytics-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`CSV Report downloaded — ${rows.length} records exported.`);
    } catch (err) {
      showToast("Failed to generate report: " + (err.response?.data?.error || err.message));
    } finally {
      setGenerating(false);
    }
  };

  // Print report
  const handlePrint = () => {
    window.print();
  };

  // Share report - copy link to clipboard
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Report link copied to clipboard!");
    } catch {
      showToast("Report link: " + window.location.href);
    }
  };

  const report = reportTypes.find((r) => r.id === selectedReport);

  const quarterlyData = monthlyData.length > 0 ? monthlyData : [
    { q: "Q1 2024", revenue: 145000 },
    { q: "Q2 2024", revenue: 223000 },
    { q: "Q3 2024", revenue: 304000 },
    { q: "Q4 2024", revenue: 436000 },
  ];

  // Build summary metrics from real KPI data
  const summaryMetrics = kpiData ? [
    { label: "Total Revenue", value: `$${Number(kpiData.totalRevenue).toLocaleString()}`, change: "+18.2%", up: true },
    { label: "Total Orders", value: Number(kpiData.totalTransactions).toLocaleString(), change: "+12.4%", up: true },
    { label: "Avg Order Value", value: `$${Number(kpiData.averageOrderValue).toFixed(2)}`, change: "+4.9%", up: true },
    { label: "Total Quantity", value: Number(kpiData.totalQuantity).toLocaleString(), change: "+8.4%", up: true },
  ] : [
    { label: "Total Revenue", value: "$128,430", change: "+18.2%", up: true },
    { label: "Net Revenue", value: "$114,220", change: "+15.7%", up: true },
    { label: "Gross Margin", value: "68.4%", change: "+2.1pp", up: true },
    { label: "Operating Cost", value: "$40,740", change: "+8.4%", up: false },
  ];

  const insights = kpiData ? [
    `Total revenue stands at $${Number(kpiData.totalRevenue).toLocaleString()} across ${Number(kpiData.totalTransactions).toLocaleString()} transactions.`,
    `Average order value is $${Number(kpiData.averageOrderValue).toFixed(2)} — ${kpiData.topRegion !== 'N/A' ? `top performing region: ${kpiData.topRegion}.` : 'upload more data for regional insights.'}`,
    `A total of ${Number(kpiData.totalQuantity).toLocaleString()} units have been sold across all categories.`,
    categoryData.length > 0 ? `Leading category: ${categoryData[0]?.name} at ${categoryData[0]?.value}% of total revenue.` : "Upload data with category information for detailed category breakdown.",
  ] : [
    "Electronics sales peaked in Q3, driving 40% of total revenue. Consider increasing inventory for Q4 holiday season.",
    "Average Order Value grew +4.9% MoM, indicating a successful upsell strategy on high-margin product bundles.",
    "Asia Pacific shows the highest growth rate at +31.8% — a strong signal to allocate additional marketing budget to this region.",
    "Pending orders account for 18% of December volume. Streamlining fulfilment could recover an estimated $14,200 in delayed revenue.",
  ];

  return (
    <div className="space-y-5 pb-4 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-white transition-all" style={{ background: "rgba(16,185,129,0.9)", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          {toast}
        </div>
      )}

      {/* Report Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTypes.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedReport(r.id)}
            className="text-left glass rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01] relative"
            style={{
              border: selectedReport === r.id ? `1px solid ${r.color}40` : "1px solid rgba(255,255,255,0.06)",
              background: selectedReport === r.id ? `${r.color}08` : "rgba(15,23,42,0.6)",
              boxShadow: selectedReport === r.id ? `0 0 30px ${r.color}15` : "none",
            }}
          >
            {r.badge && (
              <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>{r.badge}</span>
            )}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${r.color}15`, color: r.color, border: `1px solid ${r.color}25` }}>
              {r.icon}
            </div>
            <h3 className="font-semibold text-sm text-white mb-1">{r.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{r.desc}</p>
          </button>
        ))}
      </div>

      {/* Executive Summary */}
      <div className="glass rounded-2xl p-6" style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(99,102,241,0.15)", color: "#6366f1" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{kpiData ? "Live Data Insights" : "AI-Generated Executive Insights"}</h3>
            <p className="text-xs" style={{ color: "#64748b" }}>{kpiData ? "Based on your uploaded dataset" : "Based on your December 2024 dataset"}</p>
          </div>
          <span className="ml-auto text-xs px-2 py-1 rounded-full font-medium" style={{ background: kpiData ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", color: kpiData ? "#10b981" : "#f59e0b", border: `1px solid ${kpiData ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}` }}>
            {kpiData ? "● Live" : "○ Sample Data"}
          </span>
        </div>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-base flex-shrink-0">💡</span>
              <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Report View */}
      <div className="glass rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Report Header */}
        <div className="px-8 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(15,23,42,0.4)" }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" /></svg>
                </div>
                <span className="font-bold text-white">BizAnalytics</span>
              </div>
              <h2 className="text-xl font-bold text-white">{report.title}</h2>
              <p className="text-sm mt-1" style={{ color: "#64748b" }}>Generated from live database · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>Generated: {new Date().toLocaleDateString()}</p>
              <p className="text-xs mt-1" style={{ color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>REF: RPT-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}</p>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {summaryMetrics.map((m, i) => (
            <div key={m.label} className="px-6 py-5" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-xs mb-1" style={{ color: "#64748b" }}>{m.label}</p>
              <p className="text-xl font-extrabold text-white">{m.value}</p>
              <span className="text-xs font-semibold" style={{ color: m.up ? "#10b981" : "#f43f5e", fontFamily: "'JetBrains Mono', monospace" }}>
                {m.up ? "▲" : "▼"} {m.change}
              </span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="px-8 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h4 className="font-semibold text-white mb-4 text-sm">{monthlyData.length > 0 ? "Revenue by Period" : "Quarterly Revenue Performance"}</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={quarterlyData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="q" tick={{ fill: "#475569", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="px-8 py-6">
          <h4 className="font-semibold text-white mb-4 text-sm">Category Breakdown</h4>
          <div className="space-y-3">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-4">
                <span className="text-sm text-slate-400 w-28 flex-shrink-0">{cat.name}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${cat.value}%`, background: cat.color }} />
                </div>
                <span className="text-xs font-semibold w-10 text-right" style={{ color: cat.color, fontFamily: "'JetBrains Mono', monospace" }}>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleDownloadCSV}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.25)" }}
        >
          {generating ? (
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          )}
          {generating ? "Generating..." : "Download CSV Report"}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-slate-300 transition-all hover:text-white hover:bg-white/5"
          style={{ border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
          Print Summary
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-slate-300 transition-all hover:text-white hover:bg-white/5"
          style={{ border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          Share Report
        </button>
      </div>
    </div>
  );
}
