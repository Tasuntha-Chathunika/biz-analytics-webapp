import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TopBar = ({ user, onLogout, activeSubTab }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const helpRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (helpRef.current && !helpRef.current.contains(e.target)) setShowHelp(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateNew = () => {
    if (user?.role === 'admin') {
      navigate('/dashboard/upload');
    } else {
      navigate('/dashboard/analytics');
    }
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

      {/* Tabs - Only show on Overview/Team/Integrations pages */}
      {activeSubTab && (
        <div className="topbar-tabs">
          {[
            { name: 'Overview', path: '/dashboard/analytics' },
            { name: 'Team', path: '/dashboard/team' },
            { name: 'Integrations', path: '/dashboard/integrations' }
          ].map(tab => (
            <Link
              key={tab.name}
              to={tab.path}
              className={`topbar-tab flex items-center justify-center text-decoration-none ${activeSubTab === tab.name ? 'active' : ''}`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      )}

      <div className="topbar-spacer"></div>

      {/* Right Actions */}
      <div className="topbar-actions">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button 
            className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            onClick={() => { setShowNotifications(!showNotifications); setShowHelp(false); setShowUserMenu(false); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 z-50 overflow-hidden" style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-semibold text-sm text-slate-800">Notifications</h4>
                <span className="text-xs text-indigo-600 font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="px-4 py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                </div>
                <p className="text-sm font-medium text-slate-600">All caught up!</p>
                <p className="text-xs text-slate-400 mt-1">No new notifications at this time.</p>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <div className="relative" ref={helpRef}>
          <button 
            className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            onClick={() => { setShowHelp(!showHelp); setShowNotifications(false); setShowUserMenu(false); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </button>

          {showHelp && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 z-50 overflow-hidden" style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div className="px-4 py-3 border-b border-slate-100">
                <h4 className="font-semibold text-sm text-slate-800">Help & Support</h4>
              </div>
              <div className="py-1">
                {[
                  { label: "Documentation", icon: "📚", desc: "User guides & tutorials" },
                  { label: "Keyboard Shortcuts", icon: "⌨️", desc: "Speed up your workflow" },
                  { label: "Contact Support", icon: "💬", desc: "Get help from our team" },
                  { label: "What's New", icon: "✨", desc: "Latest features & updates" },
                ].map(item => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                    onClick={() => { setShowHelp(false); }}
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create New */}
        <button 
          className="hidden sm:flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
          onClick={handleCreateNew}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          {user?.role === 'admin' ? 'Upload Data' : 'View Analytics'}
        </button>

        {/* Avatar with dropdown */}
        <div className="relative" ref={userRef}>
          <div
            className="topbar-avatar cursor-pointer"
            title={`${user?.name} (${user?.role})`}
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); setShowHelp(false); }}
          >
            {getInitials(user?.name)}
          </div>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 z-50 overflow-hidden" style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
                <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">{user?.role}</span>
              </div>
              <div className="py-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left text-sm text-slate-700"
                  onClick={() => { setShowUserMenu(false); navigate('/dashboard/settings'); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                  Settings
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50 transition-colors text-left text-sm text-rose-600"
                  onClick={() => { setShowUserMenu(false); onLogout(); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
