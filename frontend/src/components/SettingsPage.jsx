import { useState } from "react";
import { clearSales } from "../api/api";

const settingsTabs = [
  {
    id: "profile", label: "General Profile", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    )
  },
  {
    id: "appearance", label: "Appearance", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
    )
  },
  {
    id: "connections", label: "Database Connections", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
    )
  },
  {
    id: "security", label: "Security", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    )
  },
];

const accentColors = [
  { id: "indigo", label: "Indigo", value: "#6366f1" },
  { id: "emerald", label: "Emerald", value: "#10b981" },
  { id: "violet", label: "Violet", value: "#8b5cf6" },
  { id: "sky", label: "Sky", value: "#38bdf8" },
  { id: "rose", label: "Rose", value: "#f43f5e" },
  { id: "amber", label: "Amber", value: "#f59e0b" },
];

const themes = [
  { id: "dark", label: "Dark Mode", icon: "🌙" },
  { id: "light", label: "Light Mode", icon: "☀️" },
  { id: "system", label: "System Default", icon: "💻" },
];

export default function SettingsPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState(null);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "viewer");
  const [company, setCompany] = useState("Acme Corp");
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [selectedAccent, setSelectedAccent] = useState("indigo");
  const [twoFa, setTwoFa] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [apiAccess, setApiAccess] = useState(false);
  const [clearing, setClearing] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Real clear data action
  const handleClearData = async () => {
    if (!window.confirm("⚠️ WARNING: This will permanently delete ALL sales records from the database. This action cannot be undone. Are you sure?")) return;
    if (!window.confirm("Please confirm one more time. ALL uploaded data will be permanently lost.")) return;

    try {
      setClearing(true);
      await clearSales();
      showToast("All uploaded data has been cleared successfully.");
    } catch (err) {
      showToast("Failed to clear data: " + (err.response?.data?.error || err.message));
    } finally {
      setClearing(false);
    }
  };

  const handleDeleteAccount = () => {
    if (!window.confirm("⚠️ DANGER: This will permanently delete your account and all associated data. This is irreversible!")) return;
    if (!window.confirm("Type DELETE to confirm: This is your last chance to cancel.")) return;
    showToast("Account deletion is not available in this version.");
  };

  return (
    <div className="flex gap-5 pb-4 relative h-full">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-emerald-900 bg-emerald-100 shadow-lg border border-emerald-200">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          {toast}
        </div>
      )}

      {/* Side nav */}
      <div className="glass-card rounded-2xl p-2 h-fit w-52 flex-shrink-0">
        {settingsTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-0.5"
            style={{
              background: activeTab === tab.id ? "rgba(99,102,241,0.1)" : "transparent",
              color: activeTab === tab.id ? "#4f46e5" : "var(--text-secondary)",
            }}
          >
            <span style={{ color: activeTab === tab.id ? "#6366f1" : "var(--text-muted)" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-4">
        {activeTab === "profile" && (
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h3 className="font-semibold text-slate-800">General Profile</h3>
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                {name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
              </div>
              <div>
                <label className="text-sm font-medium px-4 py-2 rounded-lg transition-all bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer">
                  Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={() => showToast("Profile photo updated.")} />
                </label>
                <p className="text-xs mt-1.5 text-slate-500">PNG, JPG or WEBP. Max 2MB.</p>
              </div>
            </div>
            {/* Fields */}
            <div className="grid grid-cols-2 gap-4">
              <SettingsInput label="Full Name" value={name} onChange={setName} />
              <SettingsInput label="Role" value={role} onChange={setRole} />
              <SettingsInput label="Email Address" value={email} onChange={setEmail} type="email" />
              <SettingsInput label="Company Name" value={company} onChange={setCompany} />
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
              <button
                onClick={onLogout}
                className="px-5 py-2.5 rounded-xl font-medium text-sm text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all"
              >
                Log Out
              </button>
              <button
                onClick={() => showToast("Profile saved successfully.")}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <h3 className="font-semibold text-slate-800">Appearance & Theme</h3>
            {/* Theme selector */}
            <div>
              <p className="text-sm font-medium text-slate-600 mb-3">Color Mode</p>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                    style={{
                      background: selectedTheme === t.id ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.5)",
                      border: selectedTheme === t.id ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-xs font-medium" style={{ color: selectedTheme === t.id ? "#4f46e5" : "#64748b" }}>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Accent color */}
            <div>
              <p className="text-sm font-medium text-slate-600 mb-3">Accent Color</p>
              <div className="flex gap-3 flex-wrap">
                {accentColors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedAccent(c.id); showToast(`Accent color changed to ${c.label}.`); }}
                    title={c.label}
                    className="w-9 h-9 rounded-xl transition-all hover:scale-110"
                    style={{
                      background: c.value,
                      boxShadow: selectedAccent === c.id ? `0 0 16px ${c.value}60, 0 0 0 3px ${c.value}40` : "none",
                      outline: selectedAccent === c.id ? `2px solid ${c.value}` : "2px solid transparent",
                      outlineOffset: 2,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => showToast("Appearance settings saved.")}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                Apply Theme
              </button>
            </div>
          </div>
        )}

        {activeTab === "connections" && (
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-slate-800">Database Connections</h3>
            {/* Active connection */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">PostgreSQL Pooler</p>
                <p className="text-xs mt-0.5 text-slate-500 font-mono">aws-1-ap-south-1.pooler.supabase.com:6543</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">● Connected</span>
            </div>
            {/* Add connection */}
            <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-slate-400 border border-slate-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">Add new connection</p>
                <p className="text-xs text-slate-500">MySQL, MongoDB, BigQuery, Snowflake…</p>
              </div>
              <button
                onClick={() => showToast("Additional database connections coming in a future update.")}
                className="text-xs px-3 py-1.5 rounded-lg font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm"
              >
                Connect
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-slate-800">Security Settings</h3>
              {[
                { label: "Two-Factor Authentication", desc: "Require a verification code on sign-in", value: twoFa, onChange: setTwoFa },
                { label: "Email Notifications", desc: "Alerts for login attempts and data exports", value: notifications, onChange: setNotifications },
                { label: "API Access", desc: "Allow third-party apps to connect via API key", value: apiAccess, onChange: setApiAccess },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.label}</p>
                    <p className="text-xs mt-0.5 text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => { item.onChange(!item.value); showToast(`${item.label} ${!item.value ? 'enabled' : 'disabled'}.`); }}
                    className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
                    style={{ background: item.value ? "#6366f1" : "#cbd5e1" }}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow"
                      style={{ left: item.value ? "calc(100% - 22px)" : "2px" }}
                    />
                  </button>
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => showToast("Security settings updated.")}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border border-rose-200 bg-rose-50/50">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                <h3 className="font-semibold text-rose-600">Danger Zone</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl border border-rose-200 bg-white shadow-sm">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Clear All Uploaded Data</p>
                    <p className="text-xs mt-0.5 text-slate-500">Permanently delete all CSV imports and parsed records.</p>
                  </div>
                  <button
                    onClick={handleClearData}
                    disabled={clearing}
                    className="ml-4 flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-rose-50 border border-rose-200 text-rose-600 shadow-sm disabled:opacity-50"
                  >
                    {clearing ? "Clearing..." : "Clear"}
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-rose-200 bg-white shadow-sm">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Delete Account</p>
                    <p className="text-xs mt-0.5 text-slate-500">Irreversibly remove your account, workspace, and all data.</p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="ml-4 flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-rose-50 border border-rose-200 text-rose-600 shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsInput({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 bg-white border border-slate-200 shadow-sm outline-none transition-all"
        onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)"; }}
      />
    </div>
  );
}
