

const reportCards = [
  {
    title: 'Monthly Revenue Report',
    description: 'Comprehensive breakdown of revenue across all regions and categories',
    date: 'Generated Jul 2026',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
    color: '#10b981'
  },
  {
    title: 'Product Performance',
    description: 'Top selling products with quantity and revenue analysis',
    date: 'Generated Jul 2026',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      </svg>
    ),
    color: '#3b82f6'
  },
  {
    title: 'Regional Analysis',
    description: 'Sales distribution and growth trends across geographic regions',
    date: 'Generated Jul 2026',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    color: '#8b5cf6'
  },
  {
    title: 'Category Breakdown',
    description: 'Detailed category-wise sales distribution and trends',
    date: 'Generated Jul 2026',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
      </svg>
    ),
    color: '#f59e0b'
  }
];

const ReportsPage = () => {
  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Reports</h2>
        <p className="page-subtitle">View and generate business intelligence reports</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {reportCards.map((report, index) => (
          <div
            key={index}
            className="glass-card animate-fade-in"
            style={{
              animationDelay: `${index * 0.08}s`,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${report.color}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: report.color
              }}>
                {report.icon}
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{report.title}</h3>
            </div>
            <p style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
              marginBottom: '14px'
            }}>
              {report.description}
            </p>
            <div style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontWeight: '500'
            }}>
              {report.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
