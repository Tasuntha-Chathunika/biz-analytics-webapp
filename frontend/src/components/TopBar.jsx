

const TopBar = ({ user, onLogout, activeSubTab, onSubTabChange }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="topbar">
      {/* Search */}
      <div className="topbar-search">
        <svg className="topbar-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          className="topbar-search-input" 
          placeholder="Search analytics..." 
        />
      </div>

      {/* Tabs */}
      <div className="topbar-tabs">
        {['Overview', 'Team', 'Integrations'].map(tab => (
          <button
            key={tab}
            className={`topbar-tab ${activeSubTab === tab ? 'active' : ''}`}
            onClick={() => onSubTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="topbar-spacer"></div>

      {/* Right Actions */}
      <div className="topbar-actions">
        {/* Notification Bell */}
        <button 
          className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          onClick={() => alert('No new notifications')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Help */}
        <button 
          className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          onClick={() => alert('Help center coming soon')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>

        {/* Create New */}
        <button 
          className="hidden sm:flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
          onClick={() => alert('Creation dialog coming soon')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Create New
        </button>

        {/* Avatar */}
        <div className="topbar-avatar" title={`${user?.name} (${user?.role})`} onClick={onLogout}>
          {getInitials(user?.name)}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
