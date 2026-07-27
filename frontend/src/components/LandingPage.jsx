import { Link } from "react-router-dom";

const stats = [
  { value: "10,000+", label: "Reports Generated", color: "#818cf8" },
  { value: "99.9%",   label: "Data Accuracy",     color: "#34d399" },
  { value: "850+",    label: "Active Companies",   color: "#c084fc" },
  { value: "2.3M",    label: "Rows Processed",     color: "#38bdf8" },
];

const features = [
  { icon: "⚡", title: "Instant CSV Parsing",        desc: "Drop any CSV or XLSX. Our engine detects columns, types, and outliers in under 2 seconds.", color: "#6366f1" },
  { icon: "📊", title: "Real-time Visualizations",   desc: "Area charts, donut breakdowns, regional bars, and product rankings — all linked to your live data.", color: "#10b981" },
  { icon: "📄", title: "Automated PDF Reports",       desc: "Board-ready executive summaries with AI-written insights, formatted for A4 or stakeholder email.", color: "#8b5cf6" },
  { icon: "📅", title: "Historical Trend Analysis",  desc: "Compare month-over-month or year-over-year with a single click on the date range filter.", color: "#38bdf8" },
  { icon: "👥", title: "Team Collaboration",          desc: "Invite teammates, assign roles, and share dashboards with one URL — no account required for viewers.", color: "#f43f5e" },
  { icon: "🔒", title: "Enterprise Security",         desc: "AES-256 encryption, SOC 2 Type II compliant, and role-based access for every dataset you upload.", color: "#f59e0b" },
];

const mockKPIs = [
  { label: "Total Revenue", value: "$128,430", change: "+18.2%", up: true, color: "#818cf8" },
  { label: "Total Orders",  value: "1,420",    change: "+12.5%", up: true, color: "#34d399" },
  { label: "Avg Order",     value: "$90.45",   change: "+4.9%",  up: true, color: "#38bdf8" },
  { label: "Customers",     value: "850",      change: "-2.4%",  up: false, color: "#fb7185" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-bg overflow-x-hidden">

      {/* ── Navbar ───────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 px-6 py-3.5"
        style={{ background: "rgba(6,5,15,0.9)", backdropFilter: "blur(40px)", borderBottom: "1px solid rgba(139,92,246,0.1)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)", boxShadow: "0 0 20px rgba(99,102,241,0.5)" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" /></svg>
            </div>
            <span className="font-black text-white text-base tracking-tight">BizAnalytics</span>
          </div>

          <div className="hidden md:flex items-center gap-6 ml-8">
            {["Features", "Pricing", "Documentation", "Blog"].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">{item}</a>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link to="/auth" className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5">Sign In</Link>
            <Link
              to="/auth"
              className="text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 24px rgba(99,102,241,0.4)" }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="pt-24 pb-20 px-6 text-center relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="absolute top-1/4 right-1/5 w-96 h-96 rounded-full opacity-12 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        <div className="absolute bottom-0 left-1/2 w-[500px] h-64 rounded-full opacity-08 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #10b981, transparent)" }} />

        <div className="max-w-5xl mx-auto relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-8" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: "#a5b4fc" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-dot" />
            Now with AI-generated executive insights  ✦  v2.0
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
            Turn Raw Sales Data
            <br />
            <span
              className="glow-text-violet"
              style={{ background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 30%, #ec4899 60%, #34d399 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Into Powerful Insights
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            BizAnalytics transforms messy CSVs into stunning interactive dashboards,
            KPI metrics, and board-ready executive reports — in seconds.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)", boxShadow: "0 0 40px rgba(99,102,241,0.45), 0 0 80px rgba(99,102,241,0.15)" }}
            >
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all hover:bg-white/6 hover:text-white"
              style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              View Live Demo
            </Link>
          </div>

          <p className="text-xs text-slate-600">No credit card required · Free 14-day trial · Cancel anytime</p>
        </div>

        {/* ── Dashboard mockup ──────────────────────────── */}
        <div className="mt-20 max-w-6xl mx-auto relative animate-float">
          {/* Halo */}
          <div className="absolute inset-0 rounded-3xl opacity-25 blur-2xl" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899, #10b981)" }} />

          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              transform: "perspective(1400px) rotateX(4deg) rotateY(-1.5deg)",
              boxShadow: "0 50px 130px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.15)",
              background: "rgba(6,5,15,0.97)",
            }}
          >
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(139,92,246,0.1)", background: "rgba(12,9,28,0.98)" }}>
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: "#f43f5e", boxShadow: "0 0 6px rgba(244,63,94,0.5)" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#f59e0b", boxShadow: "0 0 6px rgba(245,158,11,0.5)" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#10b981", boxShadow: "0 0 6px rgba(16,185,129,0.5)" }} />
              </div>
              <div className="mx-auto flex items-center gap-2 px-4 py-1 rounded-md text-xs text-slate-600" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                bizanalytics.app/dashboard
              </div>
            </div>

            {/* Mock content */}
            <div className="p-4 space-y-3" style={{ background: "rgba(6,5,15,0.97)" }}>
              {/* KPI row */}
              <div className="grid grid-cols-4 gap-3">
                {mockKPIs.map((kpi, i) => (
                  <div key={kpi.label} className="rounded-xl p-3 relative overflow-hidden" style={{ background: `${kpi.color}0f`, border: `1px solid ${kpi.color}20` }}>
                    <div className="absolute -right-3 -top-3 w-12 h-12 rounded-full blur-xl opacity-30" style={{ background: kpi.color }} />
                    <p className="text-xs mb-1" style={{ color: "#475569" }}>{kpi.label}</p>
                    <p className="text-base font-extrabold" style={{ color: kpi.color }}>{kpi.value}</p>
                    <span className="text-xs font-bold" style={{ color: kpi.up ? "#34d399" : "#fb7185" }}>{kpi.up ? "▲" : "▼"} {kpi.change}</span>
                  </div>
                ))}
              </div>

              {/* Chart mockup */}
              <div className="rounded-xl p-4" style={{ background: "rgba(15,12,30,0.8)", border: "1px solid rgba(139,92,246,0.1)" }}>
                <div className="flex items-end gap-1.5 h-20 mb-2">
                  {[40,55,48,71,63,89,94,112,98,128,145,163].map((v, i) => (
                    <div key={i} className="flex-1 rounded-t-md" style={{
                      height: `${(v / 163) * 100}%`,
                      background: i === 11
                        ? "linear-gradient(to top, #6366f1, #a78bfa)"
                        : i > 8
                        ? `rgba(99,102,241,${0.25 + i * 0.04})`
                        : "rgba(99,102,241,0.18)",
                      boxShadow: i === 11 ? "0 0 12px rgba(99,102,241,0.5)" : "none",
                    }} />
                  ))}
                </div>
                <div className="flex justify-between">
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
                    <span key={m} className="text-xs" style={{ color: "#334155", fontFamily: "'JetBrains Mono', monospace" }}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Mini table */}
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.08)" }}>
                {[
                  { id: "TXN-8821", name: "Marcus Chen",  amt: "$2,490", status: "Completed", sc: "#34d399" },
                  { id: "TXN-8820", name: "Sarah Jenkins", amt: "$1,120", status: "Pending",   sc: "#fbbf24" },
                ].map((row, i) => (
                  <div key={row.id} className="flex items-center gap-4 px-4 py-2.5" style={{ borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.04)" : "none", background: "rgba(12,9,28,0.7)" }}>
                    <span className="text-xs font-bold" style={{ color: "#818cf8", fontFamily: "'JetBrains Mono', monospace" }}>{row.id}</span>
                    <span className="text-xs text-slate-400 flex-1">{row.name}</span>
                    <span className="text-xs font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{row.amt}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${row.sc}15`, color: row.sc, border: `1px solid ${row.sc}25` }}>{row.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────── */}
      <section className="py-16 px-6" style={{ borderTop: "1px solid rgba(139,92,246,0.1)", borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-black mb-1" style={{ color: s.color, textShadow: `0 0 30px ${s.color}60` }}>{s.value}</p>
              <p className="text-sm text-slate-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#8b5cf6" }}>Platform Features</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Everything you need
              <br />
              <span className="grad-violet">to lead with data</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
              From raw import to polished report — every tool you need is already here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass card-hover gradient-border rounded-2xl p-6 relative overflow-hidden group"
                style={{ border: `1px solid ${f.color}18` }}
              >
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-25 pointer-events-none"
                  style={{ background: f.color }} />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-2xl transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA section ──────────────────────────────────── */}
      <section className="py-20 px-6">
        <div
          className="max-w-3xl mx-auto text-center rounded-3xl p-14 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08), rgba(16,185,129,0.06))", border: "1px solid rgba(139,92,246,0.2)" }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "radial-gradient(circle at 30% 20%, #6366f1, transparent 55%), radial-gradient(circle at 70% 80%, #10b981, transparent 55%)" }} />
          <p className="text-xs font-black uppercase tracking-widest mb-3 relative" style={{ color: "#8b5cf6" }}>Ready to ship?</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-5 relative leading-tight">
            Transform your data<br />
            <span className="grad-rainbow">starting today</span>
          </h2>
          <p className="text-slate-500 mb-10 relative">Join 850+ companies already making smarter decisions with BizAnalytics.</p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-black text-sm transition-all hover:scale-105 relative"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)", boxShadow: "0 0 50px rgba(99,102,241,0.5), 0 0 100px rgba(99,102,241,0.2)" }}
          >
            Start for free — no credit card required
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="px-6 py-8 text-center" style={{ borderTop: "1px solid rgba(139,92,246,0.08)" }}>
        <p className="text-sm text-slate-600">
          Designed &amp; Developed by{" "}
          <span className="font-bold grad-violet">S.D. Tasuntha</span>
          <span className="mx-3 text-slate-700">·</span>
          <a href="#" className="hover:text-slate-400 transition-colors text-slate-600">GitHub</a>
          <span className="mx-3 text-slate-700">·</span>
          <a href="#" className="hover:text-slate-400 transition-colors text-slate-600">Documentation</a>
          <span className="mx-3 text-slate-700">·</span>
          <a href="#" className="hover:text-slate-400 transition-colors text-slate-600">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}
