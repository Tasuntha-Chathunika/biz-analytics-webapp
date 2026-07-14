import { useState, useEffect } from 'react';
import { getRecentTransactions } from '../api/api';

const avatarColors = [
  'linear-gradient(135deg, #f97316, #ec4899)',
  'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  'linear-gradient(135deg, #10b981, #14b8a6)',
  'linear-gradient(135deg, #8b5cf6, #6366f1)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
];

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getRecentTransactions();
        setTransactions(res.data || []);
      } catch (err) {
        console.error('Failed to fetch recent transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  const formatTransactionId = (id) => {
    if (!id) return '#---';
    // Take last 4 chars of the hex id
    return '#IE-' + id.slice(-4).toUpperCase();
  };

  const getStatus = (revenue) => {
    // Derive a visual status from revenue for display
    if (revenue >= 500) return 'completed';
    if (revenue >= 100) return 'pending';
    return 'pending';
  };

  const getStatusLabel = (status) => {
    const map = { completed: 'Completed', pending: 'Pending', failed: 'Failed' };
    return map[status] || 'Pending';
  };

  const getCustomerName = (record) => {
    // Use region + category as a pseudo-customer name
    return record.region || 'Unknown';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="transactions-card">
        <div className="transactions-header">
          <h3 className="transactions-title">Recent Transactions</h3>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading transactions...
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-card animate-fade-in animate-fade-in-delay-4">
      <div className="transactions-header">
        <h3 className="transactions-title">Recent Transactions</h3>
        <button className="transactions-filter-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
      </div>

      {transactions.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No transactions found. Upload data to see recent activity.
        </div>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Amount</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => {
              const status = getStatus(tx.revenue);
              const customerName = getCustomerName(tx);
              return (
                <tr key={tx.id || index}>
                  <td>
                    <span className="transaction-id">{formatTransactionId(tx.id)}</span>
                  </td>
                  <td>
                    <div className="transaction-customer">
                      <div
                        className="transaction-customer-avatar"
                        style={{ background: avatarColors[index % avatarColors.length] }}
                      >
                        {getInitials(customerName)}
                      </div>
                      <span className="transaction-customer-name">{customerName}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${status}`}>
                      {getStatusLabel(status)}
                    </span>
                  </td>
                  <td>
                    <span className="transaction-amount">{formatCurrency(tx.revenue)}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="transaction-action-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentTransactions;
