import React, { useRef, useEffect } from 'react';
import './ConsolePanel.css';

const ConsolePanel = ({ consoleOutput, setConsoleOutput }) => {
  const consoleEndRef = useRef(null);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleOutput]);

  const getTypeLabel = (method) => {
    switch(method) {
      case 'log': return 'LOG';
      case 'error': return 'ERROR';
      case 'warn': return 'WARN';
      default: return 'INFO';
    }
  };

  return (
    <div className="console-panel">
      <div className="console-header">
        <div className="console-title">
          <span className="console-icon"></span>
          <span>Console Output</span>
          <span className="console-count">{consoleOutput.length}</span>
        </div>
        <button onClick={() => setConsoleOutput([])} className="clear-btn">
          Clear
        </button>
      </div>
      <div className="console-content">
        {consoleOutput.length === 0 ? (
          <div className="console-empty">
            <p>No console output</p>
            <small>Add console.log() to see output here</small>
          </div>
        ) : (
          consoleOutput.map((log, index) => (
            <div key={index} className={`console-entry console-${log.method}`}>
              <span className="console-time">{log.timestamp}</span>
              <span className="console-type">{getTypeLabel(log.method)}</span>
              <span className="console-message">{log.args.join(' ')}</span>
            </div>
          ))
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
};

export default ConsolePanel;