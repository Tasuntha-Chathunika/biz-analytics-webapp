import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = ({ user }) => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  // Default to dashboard if we are at exactly /dashboard
  const activeTab = pathParts.length > 1 ? pathParts[1] : 'dashboard';
  const [upgradeToast, setUpgradeToast] = useState(false);

  const handleUpgrade = () => {
    setUpgradeToast(true);
    setTimeout(() => setUpgradeToast(false), 3000);
  };


  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1"></rect>
        </svg>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
      roles: ['admin', 'manager']
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      )
    }
  ];

  // Add Upload & Ledger for admin/manager
  const adminItems = [];
  if (user?.role === 'admin') {
    adminItems.push({
      id: 'upload',
      label: 'Upload Data',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      )
    });
  }

  if (['admin', 'manager'].includes(user?.role)) {
    adminItems.push({
      id: 'ledger',
      label: 'Ledger',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    });
  }

  // Insert admin items after "Dashboard"
  const allItems = [...navItems];
  if (adminItems.length > 0) {
    const dashIdx = allItems.findIndex(i => i.id === 'dashboard');
    allItems.splice(dashIdx + 1, 0, ...adminItems);
  }

  const filteredItems = allItems.filter(item => {
    if (item.roles && !item.roles.includes(user?.role)) return false;
    return true;
  });

  return (
    <aside className="fixed top-0 left-0 w-[260px] h-screen bg-white/60 backdrop-blur-2xl border-r border-slate-200/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-[100] max-md:hidden">
      {/* Brand */}
      <div className="px-6 pt-8 pb-6 flex items-center gap-3.5 border-b border-slate-200/50">
        <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-[0_4px_16px_rgba(99,102,241,0.4)] overflow-hidden group cursor-pointer">
           <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
           <svg width="22" height="22" className="group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"></path>
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-[1.2rem] bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent leading-tight tracking-tight">InsightEngine</span>
          <span className="text-[0.65rem] font-bold text-indigo-600 tracking-widest uppercase bg-indigo-50 w-fit px-1.5 py-0.5 rounded-md mt-1 border border-indigo-100/50">Pro Plan</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 flex flex-col gap-2 overflow-y-auto">
        {filteredItems.map((item) => {
          const toPath = item.id === 'dashboard' ? '/dashboard' : `/dashboard/${item.id}`;
          return (
          <Link
            key={item.id}
            to={toPath}
            className={`relative flex items-center gap-3.5 w-full text-left px-3 py-2.5 rounded-2xl text-[0.92rem] font-semibold transition-all duration-300 ease-out cursor-pointer group overflow-hidden
              ${activeTab === item.id
                ? 'bg-gradient-to-r from-indigo-50/80 to-purple-50/80 text-indigo-800 shadow-[0_2px_12px_-2px_rgba(99,102,241,0.12)] border border-indigo-100/60'
                : 'bg-transparent text-slate-500 hover:bg-slate-50/80 border border-transparent hover:border-slate-200/50 hover:text-slate-800 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]'
              }`}
          >
            {/* Active Glow Indicator */}
            {activeTab === item.id && (
               <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.6)]"></div>
            )}
            
            {/* Icon Box */}
            <div className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-xl transition-all duration-300 ease-out
              ${activeTab === item.id 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/40' 
                : 'bg-slate-100/80 text-slate-400 group-hover:bg-indigo-100/50 group-hover:text-indigo-600 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-sm'
              }`}>
              <div className="w-5 h-5 flex items-center justify-center">
                {item.icon}
              </div>
            </div>
            
            <span className={`tracking-wide transition-all duration-300 ${activeTab === item.id ? 'translate-x-0.5' : 'group-hover:translate-x-1'}`}>
              {item.label}
            </span>
          </Link>
        )})}
      </nav>

      {/* Storage Widget */}
      <div className="p-5 border-t border-slate-200/50 bg-slate-50/30">
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-md rounded-2xl p-4 ring-1 ring-slate-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] group hover:shadow-md hover:ring-indigo-100 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
          
          <div className="flex justify-between items-center mb-3">
             <div className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-500">Storage</div>
             <div className="text-[0.75rem] font-bold text-indigo-600">75%</div>
          </div>
          
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1.5 shadow-inner">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full relative" style={{ width: '75%' }}></div>
          </div>
          
          <div className="text-[0.7rem] text-slate-500 mb-4 font-medium">75 GB of 100 GB used</div>
          
          <button 
            className="relative w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
            onClick={handleUpgrade}
          >
            Upgrade Plan
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>

      {/* Upgrade Toast */}
      {upgradeToast && (
        <div className="fixed bottom-6 left-6 z-[200] flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-lg" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          Pro upgrade coming soon! Stay tuned.
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
