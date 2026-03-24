import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const CodeEditor = () => {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [previewKey, setPreviewKey] = useState(0);
  const [layout, setLayout] = useState('side-by-side');
  const [shareUrl, setShareUrl] = useState('');
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [snippetName, setSnippetName] = useState('');
  
  const iframeRef = useRef(null);

  const getCombinedHtml = () => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>${js}</script>
</body>
</html>`;
  };

  useEffect(() => {
    setHtml(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Page</title>
</head>
<body>
    <div class="container">
        <h1>Welcome to My Code Editor! 🎉</h1>
        <p>Try editing the HTML, CSS, or JavaScript on the left!</p>
        <button id="clickMe">Click Me!</button>
    </div>
</body>
</html>`);

    setCss(`body {
    margin: 0;
    padding: 20px;
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 100vh;
}

.container {
    text-align: center;
    padding: 50px;
}

h1 {
    font-size: 3rem;
    margin-bottom: 20px;
}

button {
    padding: 10px 20px;
    font-size: 1rem;
    background: white;
    border: none;
    border-radius: 5px;
    color: #764ba2;
    cursor: pointer;
    transition: transform 0.3s;
}

button:hover {
    transform: scale(1.05);
}`);

    setJs(`console.log('Hello from JavaScript!');

document.getElementById('clickMe')?.addEventListener('click', function() {
    alert('Button clicked! Great job! 🎉');
});

console.log('The editor is ready!');`);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        const previewContent = getCombinedHtml();
        const iframeDoc = iframeRef.current.contentDocument;
        iframeDoc.open();
        iframeDoc.write(previewContent);
        iframeDoc.close();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [html, css, js, previewKey]);

  const saveToLocalStorage = () => {
    if (!snippetName.trim()) {
      alert('Please give your snippet a name!');
      return;
    }
    
    const snippet = {
      id: Date.now(),
      name: snippetName,
      html,
      css,
      js,
      timestamp: new Date().toISOString()
    };
    
    const updatedSnippets = [...savedSnippets, snippet];
    setSavedSnippets(updatedSnippets);
    localStorage.setItem('code-snippets', JSON.stringify(updatedSnippets));
    setSnippetName('');
    alert('Snippet saved! You can load it later.');
  };

  useEffect(() => {
    const stored = localStorage.getItem('code-snippets');
    if (stored) {
      setSavedSnippets(JSON.parse(stored));
    }
  }, []);

  const loadSnippet = (snippet) => {
    setHtml(snippet.html);
    setCss(snippet.css);
    setJs(snippet.js);
    setPreviewKey(prev => prev + 1);
  };

  const deleteSnippet = (id) => {
    const updated = savedSnippets.filter(s => s.id !== id);
    setSavedSnippets(updated);
    localStorage.setItem('code-snippets', JSON.stringify(updated));
  };

  const generateShareUrl = () => {
    const data = {
      html,
      css,
      js
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
    alert('Shareable URL copied to clipboard!');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedCode = params.get('code');
    if (encodedCode) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(encodedCode))));
        if (decoded.html) setHtml(decoded.html);
        if (decoded.css) setCss(decoded.css);
        if (decoded.js) setJs(decoded.js);
      } catch (error) {
        console.error('Failed to load shared code:', error);
      }
    }
  }, []);

  const resetToTemplate = () => {
    setHtml(`<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is a fresh start!</p>
</body>
</html>`);
    setCss(`body {
    font-family: Arial, sans-serif;
    margin: 40px;
    background: #f0f0f0;
    color: #333;
}

h1 {
    color: #667eea;
}`);
    setJs(`console.log('Template loaded! Ready to code!');`);
  };

  return (
    <div className="code-editor-container">
      <div className="toolbar">
        <div className="toolbar-group">
          <button onClick={() => setLayout('side-by-side')} className={layout === 'side-by-side' ? 'active' : ''}>
            📝 Side by Side
          </button>
          <button onClick={() => setLayout('editor-only')} className={layout === 'editor-only' ? 'active' : ''}>
            ✏️ Editor Only
          </button>
          <button onClick={() => setLayout('preview-only')} className={layout === 'preview-only' ? 'active' : ''}>
            👁️ Preview Only
          </button>
        </div>
        
        <div className="toolbar-group">
          <input
            type="text"
            placeholder="Give your code a name..."
            value={snippetName}
            onChange={(e) => setSnippetName(e.target.value)}
            className="snippet-input"
          />
          <button onClick={saveToLocalStorage}>💾 Save Code</button>
          <button onClick={resetToTemplate}>🔄 Reset Template</button>
          <button onClick={generateShareUrl}>🔗 Share Link</button>
        </div>
      </div>

      <div className="main-content">
        {layout !== 'preview-only' && (
          <div className={`editor-section ${layout === 'side-by-side' ? 'split' : 'full'}`}>
            <div className="editor-pane">
              <div className="editor-header">📄 HTML - Structure</div>
              <Editor
                height="calc(33vh - 40px)"
                language="html"
                value={html}
                onChange={(value) => setHtml(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on'
                }}
              />
            </div>
            
            <div className="editor-pane">
              <div className="editor-header">🎨 CSS - Style</div>
              <Editor
                height="calc(33vh - 40px)"
                language="css"
                value={css}
                onChange={(value) => setCss(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on'
                }}
              />
            </div>
            
            <div className="editor-pane">
              <div className="editor-header">⚡ JavaScript - Behavior</div>
              <Editor
                height="calc(33vh - 40px)"
                language="javascript"
                value={js}
                onChange={(value) => setJs(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on'
                }}
              />
            </div>
          </div>
        )}

        {layout !== 'editor-only' && (
          <div className={`preview-section ${layout === 'side-by-side' ? 'split' : 'full'}`}>
            <div className="preview-header">
              👁️ Live Preview - See your code in action!
              <button onClick={() => setPreviewKey(prev => prev + 1)}>🔄 Refresh</button>
            </div>
            <iframe
              ref={iframeRef}
              title="live-preview"
              className="preview-frame"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        )}
      </div>

      {savedSnippets.length > 0 && (
        <div className="snippets-panel">
          <h3>💾 Your Saved Codes</h3>
          <div className="snippets-list">
            {savedSnippets.map(snippet => (
              <div key={snippet.id} className="snippet-item">
                <div>
                  <strong>{snippet.name}</strong>
                  <small>Saved: {new Date(snippet.timestamp).toLocaleString()}</small>
                </div>
                <div>
                  <button onClick={() => loadSnippet(snippet)}>📂 Load</button>
                  <button onClick={() => deleteSnippet(snippet.id)}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;