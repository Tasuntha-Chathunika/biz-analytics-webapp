import React, { useState } from 'react';
import UploadDashboard from './components/UploadDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', marginTop: '1rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', color: 'white' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'var(--accent-color)', 
            borderRadius: '8px', 
            width: '36px', 
            height: '36px' 
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"></path>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
            </svg>
          </span>
          InsightEngine
        </h1>
      </header>

      <main>
        {!dataLoaded ? (
          <UploadDashboard onUploadSuccess={() => setDataLoaded(true)} />
        ) : (
          <AnalyticsDashboard />
        )}
      </main>
    </div>
  );
}

export default App;
