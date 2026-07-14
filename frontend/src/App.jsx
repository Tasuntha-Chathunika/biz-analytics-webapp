import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import UploadDashboard from './components/UploadDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import RecordsTable from './components/RecordsTable';
import AuthPage from './components/AuthPage';
import ActivityPage from './components/ActivityPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import { getKPIs, getProfile } from './api/api';

import LandingPage from './components/LandingPage';

function App() {
  const [user, setUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Landing vs Auth view state
  const [showAuth, setShowAuth] = useState(false);

  // 1. Check user authentication
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getProfile();
          setUser(res.data.user);
        } catch (err) {
          console.error("Session expired:", err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setCheckingUser(false);
    };
    checkAuth();
  }, [refreshTrigger]);

  // 2. Check if database has data
  useEffect(() => {
    if (!user) return;
    const checkDb = async () => {
      try {
        const res = await getKPIs();
        if (res.data && res.data.totalTransactions > 0) {
          setDataLoaded(true);
        } else {
          setDataLoaded(false);
        }
      } catch (err) {
        console.error("Failed to check database:", err);
      }
    };
    checkDb();
  }, [user, refreshTrigger]);

  const handleDataChanged = (isCleared = false) => {
    setRefreshTrigger(prev => prev + 1);
    if (isCleared) {
      setDataLoaded(false);
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setDataLoaded(false);
    setActiveTab('dashboard');
    setShowAuth(false);
  };

  if (checkingUser) {
    return (
      <div className="loading-container" style={{ height: '100vh' }}>
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading authentication session...</div>
      </div>
    );
  }

  // If not logged in, show either Landing Page or Auth Page
  if (!user) {
    if (showAuth) {
      return (
        <AuthPage 
          onAuthSuccess={(u) => { setUser(u); setRefreshTrigger(prev => prev + 1); }} 
          onBack={() => setShowAuth(false)}
        />
      );
    }
    return (
      <LandingPage onNavigate={() => {
        // Here we could pass initial state to AuthPage if we want to differentiate login vs signup
        setShowAuth(true);
      }} />
    );
  }

  // Determine if we need to show upload page or dashboard
  const showUploadScreen = !dataLoaded && user.role === 'admin' && activeTab === 'dashboard';

  const renderContent = () => {
    if (showUploadScreen) {
      return (
        <UploadDashboard onUploadSuccess={() => {
          setRefreshTrigger(prev => prev + 1);
          setActiveTab('dashboard');
        }} />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <AnalyticsDashboard refreshTrigger={refreshTrigger} userRole={user.role} />;
      case 'analytics':
        return ['admin', 'manager'].includes(user.role)
          ? <AnalyticsDashboard refreshTrigger={refreshTrigger} userRole={user.role} />
          : <AnalyticsDashboard refreshTrigger={refreshTrigger} userRole={user.role} />;
      case 'ledger':
        return ['admin', 'manager'].includes(user.role)
          ? <RecordsTable onDataChanged={handleDataChanged} userRole={user.role} />
          : null;
      case 'upload':
        return user.role === 'admin'
          ? <UploadDashboard onUploadSuccess={() => {
              setRefreshTrigger(prev => prev + 1);
              setActiveTab('dashboard');
            }} />
          : null;
      case 'reports':
        return <ReportsPage />;
      case 'activity':
        return <ActivityPage />;
      case 'settings':
        return <SettingsPage user={user} onLogout={handleLogout} />;
      default:
        return <AnalyticsDashboard refreshTrigger={refreshTrigger} userRole={user.role} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
      />

      {/* Main Area */}
      <div className="main-area">
        {/* Top Bar */}
        <TopBar
          user={user}
          onLogout={handleLogout}
          activeSubTab={activeSubTab}
          onSubTabChange={setActiveSubTab}
        />

        {/* Content */}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
