import React, { useState, useRef } from 'react';
import { uploadCSV } from '../api/api';

const UploadDashboard = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Please upload a valid CSV file.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    
    try {
      const response = await uploadCSV(file);
      onUploadSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '4rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Upload Sales Data</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Upload your raw CSV export to generate insights.</p>
      </div>
      
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".csv" 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
        
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        
        {file ? (
          <div>
            <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>{file.name}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '1rem' }}>Drag & drop your CSV file here, or</p>
            <button className="btn btn-primary" onClick={onButtonClick}>Browse Files</button>
          </div>
        )}
      </div>

      {error && <p style={{ color: 'var(--danger-color)', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
      
      {file && (
        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? 'Processing Data...' : 'Generate Analytics Dashboard'}
        </button>
      )}
    </div>
  );
};

export default UploadDashboard;
