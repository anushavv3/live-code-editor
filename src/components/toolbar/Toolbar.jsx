import React from 'react';
import './Toolbar.css';

const Toolbar = ({ 
  layout, 
  setLayout, 
  theme, 
  setTheme, 
  fontSize, 
  setFontSize,
  setShowConsole,
  showConsole,
  setShowSaveModal,
  onDownload,
  onShare,
  onReset 
}) => {
  return (
    <div className="toolbar-container">
      <div className="toolbar-left">
        <div className="logo">
          <span className="logo-icon">▌</span>
          <span className="logo-text">XentariCode</span>
          
        </div>
        
        <div className="layout-controls">
          <button 
            onClick={() => setLayout('side-by-side')} 
            className={`layout-btn ${layout === 'side-by-side' ? 'active' : ''}`}
          >
            Split
          </button>
          <button 
            onClick={() => setLayout('editor-only')} 
            className={`layout-btn ${layout === 'editor-only' ? 'active' : ''}`}
          >
            Editor
          </button>
          <button 
            onClick={() => setLayout('preview-only')} 
            className={`layout-btn ${layout === 'preview-only' ? 'active' : ''}`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="toolbar-right">
        <select 
          value={theme} 
          onChange={(e) => setTheme(e.target.value)} 
          className="theme-select"
        >
          <option value="vs-dark">Dark Theme</option>
          <option value="light">Light Theme</option>
          <option value="hc-black">High Contrast</option>
        </select>
        
        <select 
          value={fontSize} 
          onChange={(e) => setFontSize(Number(e.target.value))} 
          className="font-select"
        >
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
        </select>
        
        <button 
          onClick={() => setShowConsole(!showConsole)} 
          className={`console-toggle ${showConsole ? 'active' : ''}`}
        >
          {showConsole ? 'Hide Console' : 'Show Console'}
        </button>
        
        <button onClick={() => setShowSaveModal(true)} className="btn-save">
          Save
        </button>
        
        <button onClick={onDownload} className="btn-download">
          Download
        </button>
        
        <button onClick={onShare} className="btn-share">
          Share
        </button>
        
        <button onClick={onReset} className="btn-reset">
          Reset
        </button>
      </div>
    </div>
  );
};

export default Toolbar;