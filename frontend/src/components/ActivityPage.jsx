import { useState, useRef, useCallback, useEffect } from "react";
import { getSales, uploadCSV } from "../api/api";

const categories = ["All", "Electronics", "Fashion", "Software", "Home & Garden", "Sports"];

const statusColors = {
  Completed: "#10b981",
  Pending: "#f59e0b",
  Processing: "#38bdf8",
  Refunded: "#f43f5e",
};

const PAGE_SIZE = 8;

export default function ActivityPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch real transactions from backend
  const fetchTransactions = useCallback(async (targetPage, searchTerm) => {
    try {
      setLoading(true);
      const res = await getSales(targetPage, PAGE_SIZE, searchTerm);
      const rows = res.data.data.map((r, i) => ({
        id: `TX-${String(((targetPage - 1) * PAGE_SIZE) + i + 1001).padStart(4, '0')}`,
        date: r.transaction_date?.substring(0, 10) || '',
        customer: r.region || 'Unknown',
        product: r.product_name || r.category || '-',
        category: r.category || '-',
        unitPrice: r.quantity_sold > 0 ? (Number(r.revenue) / r.quantity_sold).toFixed(2) : '0.00',
        quantity: r.quantity_sold || 1,
        total: Number(r.revenue),
        status: Number(r.revenue) >= 500 ? 'Completed' : Number(r.revenue) >= 200 ? 'Processing' : 'Pending',
      }));
      setTransactions(rows);
      setTotalCount(res.data.pagination.totalCount);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchTransactions(page, search);
    }, 300);
    return () => clearTimeout(debounce);
  }, [page, search, fetchTransactions]);

  // Real file upload using backend API
  const handleUpload = async (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setUploadResult({ error: true, message: 'Only CSV files are supported.' });
      return;
    }
    setUploadFile(file.name);
    setUploadProgress(10);
    setUploadResult(null);

    try {
      // Simulate progress stages while actual upload happens
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 85) { clearInterval(progressInterval); return 85; }
          return prev + Math.random() * 15 + 5;
        });
      }, 200);

      const res = await uploadCSV(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult({ error: false, message: `Upload successful — ${res.data.rowsProcessed} rows processed.` });

      // Refresh the transactions table
      setTimeout(() => {
        fetchTransactions(1, search);
        setPage(1);
      }, 1000);

      // Clear upload state after showing success
      setTimeout(() => {
        setUploadProgress(null);
        setUploadFile(null);
        setUploadResult(null);
      }, 4000);
    } catch (err) {
      setUploadProgress(null);
      setUploadFile(null);
      setUploadResult({ error: true, message: err.response?.data?.error || 'Upload failed. Please try again.' });
      setTimeout(() => setUploadResult(null), 5000);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, []);

  const handleFileInput = (e) => {
    const f = e.target.files?.[0];
    if (f) handleUpload(f);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  // Client-side category filter (since backend doesn't have category filter endpoint)
  const filtered = categoryFilter === "All"
    ? transactions
    : transactions.filter(tx => tx.category === categoryFilter);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Export CSV function
  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ["Transaction ID", "Date", "Region", "Product", "Category", "Unit Price", "Qty", "Total", "Status"];
    const csvRows = [headers.join(",")];
    filtered.forEach(tx => {
      csvRows.push([tx.id, tx.date, tx.customer, `"${tx.product}"`, tx.category, tx.unitPrice, tx.quantity, tx.total, tx.status].join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <p className="text-sm mb-4" style={{ color: "#64748b" }}>Upload CSV files to add sales records to your database</p>
        <div className="flex items-center justify-center gap-2 mb-5">
          {[".CSV"].map((fmt) => (
            <span key={fmt} className="text-xs px-2.5 py-1 rounded-md font-semibold" style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>{fmt}</span>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          Browse Files
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileInput} />
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
                {uploadProgress === 100 ? "Data uploaded successfully" : "Uploading and processing CSV data..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload result toast */}
      {uploadResult && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium" style={{
          background: uploadResult.error ? "rgba(244,63,94,0.1)" : "rgba(16,185,129,0.1)",
          color: uploadResult.error ? "#fb7185" : "#34d399",
          border: `1px solid ${uploadResult.error ? "rgba(244,63,94,0.2)" : "rgba(16,185,129,0.2)"}`,
        }}>
          {uploadResult.error ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          )}
          {uploadResult.message}
        </div>
      )}

      {/* Table controls */}
      <div className="glass rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex flex-wrap items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Search by region, product, or category..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-slate-300 placeholder-slate-600 outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); }}
            className="px-3 py-2 rounded-lg text-sm text-slate-300 outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
          >
            {categories.map((c) => <option key={c} value={c} style={{ background: "#0f172a" }}>{c}</option>)}
          </select>
          <button
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 transition-all hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ border: "1px solid rgba(255,255,255,0.1)", marginLeft: "auto" }}
          >
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
              {loading ? (
                <tr><td colSpan={9} className="text-center py-12 text-slate-600">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                    Loading transactions...
                  </div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-slate-600">No records found. Upload a CSV file to get started.</td></tr>
              ) : filtered.map((tx, i) => (
                <tr key={tx.id + i} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
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
            {totalCount > 0
              ? `Showing ${Math.min((page - 1) * PAGE_SIZE + 1, totalCount)}–${Math.min(page * PAGE_SIZE, totalCount)} of ${totalCount} records`
              : 'No records'}
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1 || loading} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 transition-colors disabled:opacity-30 hover:bg-white/5">← Prev</button>
            {totalPages <= 7 ? (
              Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
              ))
            ) : (
              <span className="text-xs text-slate-500 px-2 py-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Page {page} of {totalPages}
              </span>
            )}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages || loading} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 transition-colors disabled:opacity-30 hover:bg-white/5">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
