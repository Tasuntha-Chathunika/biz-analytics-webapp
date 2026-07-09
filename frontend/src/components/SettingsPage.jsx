import React, { useState } from 'react';

const SettingsPage = ({ user, onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
        <p className="page-subtitle">Manage your account and application preferences</p>
      </div>

      {/* Account Section */}
      <div className="glass-card animate-fade-in" style={{ marginBottom: '20px' }}>
        <div className="settings-section">
          <div className="settings-section-title">Account</div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">{user?.name || 'User'}</div>
              <div className="settings-row-desc">{user?.email || 'No email'}</div>
            </div>
            <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Sign Out</div>
              <div className="settings-row-desc">Log out of your current session</div>
            </div>
            <button
              className="btn btn-danger-outline btn-sm"
              onClick={onLogout}
              style={{ padding: '6px 14px', borderRadius: '8px' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-card animate-fade-in animate-fade-in-delay-1" style={{ marginBottom: '20px' }}>
        <div className="settings-section">
          <div className="settings-section-title">Preferences</div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Dark Mode</div>
              <div className="settings-row-desc">Switch between light and dark themes</div>
            </div>
            <button
              className={`toggle-switch ${darkMode ? 'active' : ''}`}
              onClick={() => setDarkMode(!darkMode)}
            ></button>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Auto Refresh</div>
              <div className="settings-row-desc">Automatically refresh dashboard data</div>
            </div>
            <button
              className={`toggle-switch ${autoRefresh ? 'active' : ''}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
            ></button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card animate-fade-in animate-fade-in-delay-2">
        <div className="settings-section">
          <div className="settings-section-title">Notifications</div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Email Notifications</div>
              <div className="settings-row-desc">Receive email alerts for important events</div>
            </div>
            <button
              className={`toggle-switch ${emailNotifs ? 'active' : ''}`}
              onClick={() => setEmailNotifs(!emailNotifs)}
            ></button>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Push Notifications</div>
              <div className="settings-row-desc">Browser push notifications for real-time updates</div>
            </div>
            <button
              className={`toggle-switch ${pushNotifs ? 'active' : ''}`}
              onClick={() => setPushNotifs(!pushNotifs)}
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
