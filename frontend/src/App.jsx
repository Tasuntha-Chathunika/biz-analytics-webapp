import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const navigate = useNavigate();

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
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setDataLoaded(false);
    navigate('/');
  };

  if (checkingUser) {
    return (
      <div className="loading-container" style={{ height: '100vh' }}>
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading authentication session...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/auth" element={
        user ? <Navigate to="/dashboard" /> : <AuthPage onAuthSuccess={(u) => { setUser(u); setRefreshTrigger(prev => prev + 1); navigate('/dashboard'); }} />
      } />
      <Route path="/dashboard/*" element={
        user ? (
          <div className="app-layout">
            <Sidebar user={user} />
            <div className="main-area">
              <TopBar user={user} onLogout={handleLogout} activeSubTab={activeSubTab} onSubTabChange={setActiveSubTab} />
              <main className="main-content">
                <Routes>
                   <Route path="/" element={
                     (!dataLoaded && user.role === 'admin') 
                       ? <UploadDashboard onUploadSuccess={() => { setRefreshTrigger(prev => prev + 1); navigate('/dashboard'); }} />
                       : <AnalyticsDashboard refreshTrigger={refreshTrigger} userRole={user.role} />
                   } />
                   <Route path="analytics" element={<AnalyticsDashboard refreshTrigger={refreshTrigger} userRole={user.role} />} />
                   
                   {['admin', 'manager'].includes(user.role) && (
                     <Route path="ledger" element={<RecordsTable onDataChanged={handleDataChanged} userRole={user.role} />} />
                   )}
                   
                   {user.role === 'admin' && (
                     <Route path="upload" element={<UploadDashboard onUploadSuccess={() => { setRefreshTrigger(prev => prev + 1); navigate('/dashboard'); }} />} />
                   )}
                   
                   <Route path="reports" element={<ReportsPage />} />
                   <Route path="activity" element={<ActivityPage />} />
                   <Route path="settings" element={<SettingsPage user={user} onLogout={handleLogout} />} />
                   
                   <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : <Navigate to="/auth" />
      } />
    </Routes>
  );
}

export default App;
