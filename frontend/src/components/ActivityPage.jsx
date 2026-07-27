import { useState, useRef, useCallback } from "react";
import { transactions } from "../mockData";

const categories = ["All", "Electronics", "Fashion", "Software", "Home & Garden", "Sports"];

const statusColors: Record<string, string> = {
  Completed: "#10b981",
  Pending: "#f59e0b",
  Processing: "#38bdf8",
  Refunded: "#f43f5e",
};

const PAGE_SIZE = 8;

export default function ActivityPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const dropRef = useRef<HTMLDivElement>(null);

  const simulateUpload = (name: string) => {
    setUploadFile(name);
    setUploadProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => { setUploadProgress(null); setUploadFile(null); }, 2000); }
      setUploadProgress(Math.min(p, 100));
    }, 120);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateUpload(file.name);
  }, []);

  const filtered = transactions.filter((tx) => {
    const matchSearch = search === "" || tx.product.toLowerCase().includes(search.toLowerCase()) || tx.id.toLowerCase().includes(search.toLowerCase()) || tx.customer.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || tx.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5 pb-4">
      {/* Upload Zone */}
      <div
        ref={dropRef}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="glass rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden"
        style={{
          border: isDragging ? "2px solid rgba(99,102,241,0.7)" : "2px dashed rgba(255,255,255,0.1)",
          background: isDragging ? "rgba(99,102,241,0.08)" : "rgba(15,23,42,0.5)",
          boxShadow: isDragging ? "0 0 40px rgba(99,102,241,0.2), inset 0 0 40px rgba(99,102,241,0.05)" : "none",
        }}
      >
        {isDragging && (
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.1), transparent 70%)" }} />
        )}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all" style={{ background: isDragging ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.1)", color: "#6366f1" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
          </svg>
        </div>
        <h3 className="font-semibold text-white mb-1">{isDragging ? "Drop your file here" : "Drag & Drop your data file"}</h3>
        <p className="text-sm mb-4" style={{ color: "#64748b" }}>Supports CSV and XLSX formats up to 50MB</p>
        <div className="flex items-center justify-center gap-2 mb-5">
          {[".CSV", ".XLSX", ".TSV"].map((fmt) => (
            <span key={fmt} className="text-xs px-2.5 py-1 rounded-md font-semibold" style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>{fmt}</span>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          Browse Files
          <input type="file" accept=".csv,.xlsx,.tsv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) simulateUpload(f.name); }} />
        </label>
      </div>

      {/* Upload progress */}
      {uploadProgress !== null && (
        <div className="glass rounded-2xl p-5" style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(99,102,241,0.15)", color: "#6366f1" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-white truncate">{uploadFile}</p>
                <span className="text-xs font-semibold ml-4 flex-shrink-0" style={{ color: uploadProgress === 100 ? "#10b981" : "#6366f1", fontFamily: "'JetBrains Mono', monospace" }}>
                  {uploadProgress === 100 ? "✓ Complete" : `${Math.round(uploadProgress)}%`}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%`, background: uploadProgress === 100 ? "linear-gradient(to right, #10b981, #059669)" : "linear-gradient(to right, #6366f1, #8b5cf6)" }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                {uploadProgress === 100 ? "450 rows detected — data is ready" : "Parsing CSV data..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table controls */}
      <div className="glass rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex flex-wrap items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Search by product, ID, or customer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-slate-300 placeholder-slate-600 outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg text-sm text-slate-300 outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
          >
            {categories.map((c) => <option key={c} value={c} style={{ background: "#0f172a" }}>{c}</option>)}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 transition-all hover:text-white hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.1)", marginLeft: "auto" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Transaction ID", "Date", "Customer", "Product", "Category", "Unit Price", "Qty", "Total", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#475569" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-slate-600">No records match your filters</td></tr>
              ) : paginated.map((tx, i) => (
                <tr key={tx.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: i < paginated.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium" style={{ color: "#6366f1", fontFamily: "'JetBrains Mono', monospace" }}>{tx.id}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{tx.date}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-300 whitespace-nowrap">{tx.customer}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-400 max-w-[140px] truncate">{tx.product}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}>{tx.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>${tx.unitPrice}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-400 text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{tx.quantity}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>${tx.total.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: `${statusColors[tx.status]}15`, color: statusColors[tx.status], border: `1px solid ${statusColors[tx.status]}25` }}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs" style={{ color: "#475569" }}>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 transition-colors disabled:opacity-30 hover:bg-white/5">← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-7 h-7 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: page === p ? "rgba(99,102,241,0.25)" : "transparent",
                  color: page === p ? "#a5b4fc" : "#64748b",
                  border: page === p ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                }}
              >
                {p}
              </button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 transition-colors disabled:opacity-30 hover:bg-white/5">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
