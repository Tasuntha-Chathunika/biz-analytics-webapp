import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, signup } from "../api/api";

export default function AuthPage({ onAuthSuccess }) {
  const [tab, setTab] = useState("signin");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("admin");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let res;
      if (tab === "signin") {
        res = await login(email, password);
      } else {
        res = await signup(email, password, name || "User", role);
      }
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      if (onAuthSuccess) {
        onAuthSuccess(user);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
      <div className="absolute bottom-1/4 right-1/5 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />

      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 shadow-lg backdrop-blur-sm"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Home
      </button>
      <div className="w-full max-w-md relative">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-primary" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">BizAnalytics</span>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-1">
            {tab === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm" style={{ color: "#64748b" }}>
            {tab === "signin" ? "Sign in to your workspace" : "Start your 14-day free trial"}
          </p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8" style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>
          {/* Tab toggle */}
          <div className="flex mb-6 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {(["signin", "signup"]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: tab === t ? "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))" : "transparent",
                  color: tab === t ? "#fff" : "#64748b",
                  border: tab === t ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                }}
              >
                {t === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Social auth */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              {
                label: "Google",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                ),
              },
              {
                label: "GitHub",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                ),
              },
            ].map((social) => (
              <button
                key={social.label}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-slate-300 transition-all hover:text-white hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {social.icon}
                {social.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-xs" style={{ color: "#475569" }}>or continue with email</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <FloatingInput label="Full Name" value={name} onChange={setName} type="text" required />
                  <FloatingInput label="Company" value={company} onChange={setCompany} type="text" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <option value="admin" style={{ background: "#0f172a" }}>Admin</option>
                    <option value="manager" style={{ background: "#0f172a" }}>Manager</option>
                    <option value="viewer" style={{ background: "#0f172a" }}>Viewer</option>
                  </select>
                </div>
              </>
            )}
            <FloatingInput label="Email address" value={email} onChange={setEmail} type="email" required />
            <div className="relative">
              <FloatingInput label="Password" value={password} onChange={setPassword} type={showPass ? "text" : "password"} required />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>

            {tab === "signin" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "#6366f1" }}
                  />
                  <span className="text-sm" style={{ color: "#64748b" }}>Remember me</span>
                </label>
                <a href="#" className="text-sm transition-colors hover:text-white" style={{ color: "#6366f1" }}>Forgot password?</a>
              </div>
            )}

            {error && (
              <div className="text-sm text-center py-2 px-3 rounded-xl" style={{ background: "rgba(244,63,94,0.1)", color: "#fb7185", border: "1px solid rgba(244,63,94,0.2)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.25)" }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                  Authenticating...
                </>
              ) : (
                tab === "signin" ? "Sign In to Dashboard" : "Create Free Account"
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "#475569" }}>
            {tab === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setTab(tab === "signin" ? "signup" : "signin")} className="font-medium transition-colors hover:text-white" style={{ color: "#6366f1" }}>
              {tab === "signin" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#334155" }}>
          By continuing, you agree to our{" "}
          <a href="#" className="underline hover:text-slate-400">Terms of Service</a> and{" "}
          <a href="#" className="underline hover:text-slate-400">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

function FloatingInput({ label, value, onChange, type, required }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-4 pt-5 pb-2 rounded-xl text-sm text-white outline-none transition-all peer"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: focused ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
        }}
      />
      <label
        className="absolute left-4 transition-all duration-200 pointer-events-none"
        style={{
          top: active ? "8px" : "50%",
          transform: active ? "none" : "translateY(-50%)",
          fontSize: active ? "10px" : "14px",
          color: focused ? "#6366f1" : "#64748b",
          letterSpacing: active ? "0.05em" : "normal",
          fontWeight: active ? 600 : 400,
        }}
      >
        {label}
      </label>
    </div>
  );
}
