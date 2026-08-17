import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ThreeBackground from "./ThreeBackground";

const stats = [
  { value: "10,000+", label: "Reports Generated" },
  { value: "99.9%",   label: "Data Accuracy" },
  { value: "850+",    label: "Active Companies" },
  { value: "2.3M",    label: "Rows Processed" },
];

const features = [
  { 
    title: "Instant CSV Parsing", 
    desc: "Drop any CSV or XLSX. Our engine detects columns, types, and outliers in under 2 seconds.", 
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
    color: "#6366f1" 
  },
  { 
    title: "Real-time Visualizations", 
    desc: "Area charts, donut breakdowns, regional bars, and product rankings — all linked to your live data.", 
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>,
    color: "#10b981" 
  },
  { 
    title: "Automated PDF Reports", 
    desc: "Board-ready executive summaries with AI-written insights, formatted for A4 or stakeholder email.", 
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    color: "#8b5cf6" 
  },
  { 
    title: "Historical Trend Analysis", 
    desc: "Compare month-over-month or year-over-year with a single click on the date range filter.", 
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
    color: "#38bdf8" 
  },
  { 
    title: "Team Collaboration", 
    desc: "Invite teammates, assign roles, and share dashboards with one URL — no account required for viewers.", 
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
    color: "#f43f5e" 
  },
  { 
    title: "Enterprise Security", 
    desc: "AES-256 encryption, SOC 2 Type II compliant, and role-based access for every dataset you upload.", 
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
    color: "#f59e0b" 
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Framer Motion values for interactive 3D elements
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Map mouse coordinates to 3D rotation angles for the dashboard mockup
  // Reversing the maps gives a natural "tilt towards mouse" parallax effect
  const rotateX = useTransform(smoothMouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-8, 8]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen overflow-x-hidden relative bg-[#FAFAFA] selection:bg-indigo-500/20 selection:text-indigo-900 font-['Inter',sans-serif]">
      <ThreeBackground />
      


      {/* ── Spotlight Cursor Effect ── */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99,102,241,0.06), transparent 40%)`
        }}
      />

import Navbar3DLogo from "./Navbar3DLogo";

// ... existing code in LandingPage ...
      {/* ── Navbar ───────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 transition-all duration-300 w-[96%] max-w-7xl rounded-full"
        style={{ 
          background: "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.4))", 
          backdropFilter: "blur(24px)", 
          WebkitBackdropFilter: "blur(24px)", 
          border: "1px solid rgba(255,255,255,0.8)",
          boxShadow: "0 10px 40px -10px rgba(99,102,241,0.2)"
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8 lg:gap-12">
            <div className="flex items-center gap-2 cursor-pointer group">
              <Navbar3DLogo />
              <span className="font-[900] text-[1.3rem] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 drop-shadow-sm">BizAnalytics</span>
            </div>

            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {["Product", "Solutions", "Developers", "Resources", "Pricing"].map((item) => (
                <a key={item} href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-[14px] font-semibold text-slate-700 hover:text-indigo-600 transition-colors relative after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300">{item}</a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-[14px] font-semibold text-slate-700 hover:text-indigo-600 transition-colors hidden sm:block mr-2">Sign in</Link>
            <Link
              to="/auth"
              className="text-[14px] font-bold text-white px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-500/50"
            >
              Start for free
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="pt-28 pb-20 px-6 text-center relative z-10">
        <motion.div 
          className="max-w-[1000px] mx-auto relative"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium mb-10 shadow-sm border border-slate-200/60 bg-white/50 backdrop-blur-md text-slate-600 transition-all hover:bg-white cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Introducing BizAnalytics 2.0 with AI Insights <span className="text-slate-300 mx-1">|</span> <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">Read the announcement &rarr;</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-[56px] md:text-[84px] font-[800] text-slate-900 mb-8 leading-[1.05] tracking-[-0.04em] font-['Inter',sans-serif]">
            Turn complex data into
            <br />
            <span
              className="animate-gradient bg-[length:200%_auto]"
              style={{ background: "linear-gradient(to right, #4f46e5, #ec4899, #f59e0b, #4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              beautiful insights.
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-[18px] md:text-[21px] text-slate-500 mb-12 max-w-2xl mx-auto leading-[1.6] font-normal tracking-[-0.01em]">
            The complete analytics platform for modern teams. Drop any CSV, build stunning interactive dashboards, and generate board-ready reports in seconds.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              to="/auth"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-medium text-[16px] transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-[0_8px_30px_rgba(79,70,229,0.3)] animate-gradient bg-[length:200%_auto]"
              style={{ background: "linear-gradient(to right, #4f46e5, #a855f7, #ec4899, #4f46e5)" }}
            >
              Start Building Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-[16px] transition-all duration-300 hover:bg-slate-50 hover:-translate-y-1 text-slate-700 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-200/80 hover:border-slate-300 group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 group-hover:text-indigo-600 transition-colors"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              View live demo
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Dashboard mockup with 3D Mouse Parallax ── */}
        <motion.div 
          className="mt-16 max-w-[1100px] mx-auto relative z-10"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 2000 }}
        >
          <div className="absolute inset-0 rounded-[32px] opacity-20 blur-[80px]" style={{ background: "linear-gradient(135deg, #4f46e5, #ec4899)" }} />

          <motion.div
            className="relative rounded-[24px] overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 p-2"
            style={{
              rotateX,
              rotateY,
              boxShadow: "0 35px 60px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)",
            }}
          >
            <div className="rounded-[18px] overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-2xl relative">
              <div className="flex items-center gap-3 px-5 py-4 bg-[#111] border-b border-white/5">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <div className="mx-auto flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-medium text-white/40 bg-white/5 border border-white/5 min-w-[200px]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  bizanalytics.app/dashboard
                </div>
              </div>

              <div className="bg-[#0A0A0A] relative group">
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="w-full aspect-[16/9] relative overflow-hidden">
                  <img 
                    src="/dashboard-mockup.png" 
                    alt="BizAnalytics Dashboard Mockup" 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-1000" 
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
                  />
                  <div className="w-full h-full items-center justify-center hidden" style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)' }}>
                    <div className="text-center px-8">
                      <div className="flex justify-center gap-4 mb-6">
                        <div className="w-16 h-24 rounded-lg" style={{ background: 'linear-gradient(to top, #6366f1, #818cf8)', opacity: 0.8 }} />
                        <div className="w-16 h-32 rounded-lg" style={{ background: 'linear-gradient(to top, #10b981, #34d399)', opacity: 0.8 }} />
                        <div className="w-16 h-20 rounded-lg" style={{ background: 'linear-gradient(to top, #8b5cf6, #a78bfa)', opacity: 0.8 }} />
                        <div className="w-16 h-28 rounded-lg" style={{ background: 'linear-gradient(to top, #f59e0b, #fbbf24)', opacity: 0.8 }} />
                      </div>
                      <p className="text-white/60 text-sm font-medium">Interactive Analytics Dashboard</p>
                      <p className="text-white/30 text-xs mt-1">Sign in to explore your data →</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features grid ────────────────────────────────── */}
      <section id="features" className="py-28 px-6 relative z-10 bg-[#FAFAFA] border-t border-slate-200/50">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-[40px] md:text-[48px] font-[800] text-slate-900 mb-6 leading-tight tracking-[-0.03em]">
              Everything you need to scale
            </h2>
            <p className="text-[18px] text-slate-500 max-w-2xl mx-auto leading-relaxed font-normal">
              A complete toolkit designed to eliminate manual reporting. Beautiful by default, powerful by design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                variants={fadeInUp}
                key={f.title}
                className="bg-white rounded-[20px] p-8 relative overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-200/60"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-6 text-slate-700 bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md">
                  {f.icon}
                </div>
                <h3 className="relative z-10 font-semibold text-slate-900 mb-3 text-[18px] tracking-tight group-hover:text-indigo-600 transition-colors">{f.title}</h3>
                <p className="relative z-10 text-[15px] leading-relaxed text-slate-500 font-normal">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      
    </div>
  );
}
