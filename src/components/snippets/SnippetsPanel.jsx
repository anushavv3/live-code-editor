import React from 'react';
import './SnippetsPanel.css';

const SnippetsPanel = ({ savedSnippets, onLoad, onDelete }) => {
  if (savedSnippets.length === 0) return null;

  return (
    <div className="snippets-panel">
      <div className="snippets-header">
        <span className="snippets-icon">#</span>
        <span>Saved Snippets</span>
        <span className="snippets-count">{savedSnippets.length}</span>
      </div>
      <div className="snippets-list">
        {savedSnippets.map(snippet => (
          <div key={snippet.id} className="snippet-card">
            <div className="snippet-info">
              <strong className="snippet-name">{snippet.name}</strong>
              <span className="snippet-date">
                {new Date(snippet.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="snippet-actions">
              <button 
                onClick={() => onLoad(snippet)} 
                className="load-btn"
              >
                Load
              </button>
              <button 
                onClick={() => onDelete(snippet.id)} 
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SnippetsPanel;