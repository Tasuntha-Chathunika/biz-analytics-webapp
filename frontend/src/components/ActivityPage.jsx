

const sampleActivities = [
  {
    type: 'upload',
    text: '<strong>Admin User</strong> uploaded a new CSV dataset',
    time: '2 hours ago'
  },
  {
    type: 'login',
    text: '<strong>Manager User</strong> logged into the system',
    time: '4 hours ago'
  },
  {
    type: 'delete',
    text: '<strong>Admin User</strong> deleted 3 outdated records',
    time: 'Yesterday at 3:45 PM'
  },
  {
    type: 'login',
    text: '<strong>Viewer User</strong> accessed the dashboard',
    time: 'Yesterday at 11:20 AM'
  },
  {
    type: 'upload',
    text: '<strong>Admin User</strong> generated analytics report',
    time: '2 days ago'
  },
  {
    type: 'login',
    text: '<strong>Manager User</strong> reviewed the ledger',
    time: '3 days ago'
  }
];

const ActivityPage = () => {
  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Activity</h2>
        <p className="page-subtitle">Recent system activity and user actions</p>
      </div>

      <div className="glass-card">
        <div className="activity-list">
          {sampleActivities.map((activity, index) => (
            <div key={index} className="activity-item animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className={`activity-icon activity-icon-${activity.type}`}>
                {activity.type === 'upload' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                )}
                {activity.type === 'delete' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                )}
                {activity.type === 'login' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                )}
              </div>
              <div className="activity-content">
                <div className="activity-text" dangerouslySetInnerHTML={{ __html: activity.text }}></div>
                <div className="activity-time">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
