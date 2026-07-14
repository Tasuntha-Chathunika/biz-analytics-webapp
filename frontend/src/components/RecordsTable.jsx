import React, { useState, useEffect } from 'react';
import { getSales, deleteSale, clearSales } from '../api/api';

const RecordsTable = ({ onDataChanged, userRole }) => {
  const [records, setRecords] = useState([]);
  const isManager = userRole === 'manager';
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [clearing, setClearing] = useState(false);

  const fetchRecords = async (targetPage, searchTerm) => {
    try {
      setLoading(true);
      const response = await getSales(targetPage, limit, searchTerm);
      setRecords(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalCount(response.data.pagination.totalCount);
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search trigger
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRecords(page, search);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      setDeletingId(id);
      await deleteSale(id);
      
      // Calculate target page after deletion
      // If we deleted the last item on the current page, go to previous page
      const newPage = (records.length === 1 && page > 1) ? page - 1 : page;
      setPage(newPage);
      fetchRecords(newPage, search);
      
      if (onDataChanged) {
        onDataChanged();
      }
    } catch (err) {
      alert("Failed to delete record: " + (err.response?.data?.error || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("WARNING: This will delete ALL records from the database. Are you sure?")) return;
    try {
      setClearing(true);
      await clearSales();
      setRecords([]);
      setTotalPages(1);
      setTotalCount(0);
      setPage(1);
      
      if (onDataChanged) {
        onDataChanged(true); // pass true to indicate full wipe
      }
    } catch (err) {
      alert("Failed to clear database: " + (err.response?.data?.error || err.message));
    } finally {
      setClearing(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  };

  const formatDatePicker = (dateStr) => {
    if (!dateStr) return '';
    // Format YYYY-MM-DD
    return dateStr.substring(0, 10);
  };

  return (
    <div className="glass-card">
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3>Sales Ledger</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Browse, search, and manage transaction records
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="search-wrapper">
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search region, category..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {!isManager && (
            <button 
              className="btn btn-danger-outline btn-sm" 
              onClick={handleClearAll}
              disabled={clearing || totalCount === 0}
            >
              {clearing ? 'Clearing...' : 'Wipe Database'}
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        {loading && records.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading ledger records...
          </div>
        ) : records.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No records found.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Region</th>
                <th>Category</th>
                <th>Product</th>
                <th style={{ textAlign: 'right' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Revenue</th>
                {!isManager && <th style={{ textAlign: 'center' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{formatDatePicker(record.transaction_date)}</td>
                  <td>{record.region}</td>
                  <td>{record.category || '-'}</td>
                  <td>{record.product_name || '-'}</td>
                  <td style={{ textAlign: 'right', fontWeight: '500' }}>{record.quantity_sold}</td>
                  <td style={{ textAlign: 'right', color: 'var(--success-color)', fontWeight: '500' }}>
                    {formatCurrency(record.revenue)}
                  </td>
                  {!isManager && (
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-danger-outline btn-sm"
                        style={{ padding: '0.25rem 0.5rem', borderRadius: '4px' }}
                        onClick={() => handleDelete(record.id)}
                        disabled={deletingId === record.id}
                      >
                        {deletingId === record.id ? (
                          '...'
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        )}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalCount > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing <strong>{(page - 1) * limit + 1}</strong> to <strong>{Math.min(page * limit, totalCount)}</strong> of <strong>{totalCount}</strong> transactions
          </div>
          
          <div className="pagination-buttons">
            <button 
              className="btn-icon" 
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1 || loading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className="page-indicator">
              Page {page} of {totalPages}
            </div>
            <button 
              className="btn-icon" 
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || loading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordsTable;
