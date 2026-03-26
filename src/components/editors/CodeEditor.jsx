import React from 'react';
import HTMLEditor from './HTMLEditor';
import CSSEditor from './CSSEditor';
import JSEditor from './JSEditor';
import './CodeEditor.css';

const CodeEditor = ({ 
  html, setHtml, 
  css, setCss, 
  js, setJs,
  theme, 
  fontSize,
  activeFile 
}) => {
  return (
    <div className="code-editor-container">
      {activeFile === 'html' && (
        <HTMLEditor 
          value={html} 
          onChange={setHtml} 
          theme={theme} 
          fontSize={fontSize} 
        />
      )}
      {activeFile === 'css' && (
        <CSSEditor 
          value={css} 
          onChange={setCss} 
          theme={theme} 
          fontSize={fontSize} 
        />
      )}
      {activeFile === 'js' && (
        <JSEditor 
          value={js} 
          onChange={setJs} 
          theme={theme} 
          fontSize={fontSize} 
        />
      )}
    </div>
  );
};

export default CodeEditor;