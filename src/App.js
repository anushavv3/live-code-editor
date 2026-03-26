import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from './components/editors/CodeEditor';
import LivePreview from './components/preview/LivePreview';
import Toolbar from './components/toolbar/Toolbar';
import ConsolePanel from './components/console/ConsolePanel';
import SnippetsPanel from './components/snippets/SnippetsPanel';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  
  const [previewKey, setPreviewKey] = useState(0);
  const [layout, setLayout] = useState('side-by-side');
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activeFile, setActiveFile] = useState('html');
  const [snippetName, setSnippetName] = useState('');
  
  const iframeRef = useRef(null);

  useEffect(() => {
    document.title = "XentariCode - Live Code Editor";
    
    // HTML Template - Simple button
    setHtml(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XentariCode Demo</title>
</head>
<body>
    <div class="container">
        <h1>Welcome to XentariCode</h1>
        <p>Edit the code on the left to see changes</p>
        
        <button id="clickMeBtn" class="demo-button">
            Click Me!
        </button>
        
        <div id="messageBox" class="message-box"></div>
    </div>
</body>
</html>`);

    // CSS Template
    setCss(`* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.container {
    background: white;
    padding: 40px;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    max-width: 500px;
    width: 100%;
}

h1 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
    font-size: 28px;
}

p {
    color: #666;
    margin-bottom: 24px;
    line-height: 1.5;
}

.demo-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: background 0.3s ease;
    margin-bottom: 20px;
}

.demo-button:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.message-box {
    margin-top: 20px;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    display: none;
}

.message-box.show {
    display: block;
    animation: fadeInUp 0.3s ease;
}

.message-box.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 480px) {
    .container {
        padding: 24px;
    }
    
    h1 {
        font-size: 22px;
    }
    
    .demo-button {
        width: 100%;
    }
}`);

    // JavaScript Template - Works on first click
    setJs(`// XentariCode Interactive Demo
console.log('XentariCode is ready!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Setting up button');
    
    const button = document.getElementById('clickMeBtn');
    const messageBox = document.getElementById('messageBox');
    
    function showMessage(text) {
        if (messageBox) {
            messageBox.textContent = text;
            messageBox.className = 'message-box success show';
            setTimeout(() => {
                messageBox.classList.remove('show');
            }, 3000);
        }
    }
    
    if (button) {
        button.onclick = function() {
            console.log('Button clicked!');
            alert('Hello from XentariCode!');
            showMessage('✨ Welcome to XentariCode.');
        };
    }
});

console.log('Ready to go!');`);
  }, []);

  const getCombinedHtml = () => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      html {
        scroll-behavior: smooth;
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
    </style>
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>
      (function() {
        // Capture console logs
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = function(...args) {
          if (window.parent !== window) {
            window.parent.postMessage({ type: 'console', method: 'log', args: args }, '*');
          }
          originalLog.apply(console, args);
        };
        
        console.error = function(...args) {
          if (window.parent !== window) {
            window.parent.postMessage({ type: 'console', method: 'error', args: args }, '*');
          }
          originalError.apply(console, args);
        };
        
        console.warn = function(...args) {
          if (window.parent !== window) {
            window.parent.postMessage({ type: 'console', method: 'warn', args: args }, '*');
          }
          originalWarn.apply(console, args);
        };
        
        console.log('Preview iframe loaded');
      })();
    </script>
    <script>
      // Simple button handler - Works on first click
      document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded');
        
        const button = document.getElementById('clickMeBtn');
        const messageBox = document.getElementById('messageBox');
        
        console.log('Button exists:', !!button);
        
        function showMessage(text) {
          if (messageBox) {
            messageBox.textContent = text;
            messageBox.className = 'message-box success show';
            setTimeout(() => {
              messageBox.classList.remove('show');
            }, 3000);
          }
        }
        
        if (button) {
          button.onclick = function(e) {
            e.preventDefault();
            console.log('Button clicked - Alert should show');
            alert('Hello from XentariCode!');
            showMessage('✨ Welcome to XentariCode.');
          };
        }
      });
    </script>
    <script>${js}</script>
</body>
</html>`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        const previewContent = getCombinedHtml();
        const iframeDoc = iframeRef.current.contentDocument;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(previewContent);
          iframeDoc.close();
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [html, css, js, previewKey]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'console') {
        if (event.data.method === 'clear') {
          setConsoleOutput([]);
        } else {
          setConsoleOutput(prev => [...prev, {
            method: event.data.method,
            args: event.data.args,
            timestamp: new Date().toLocaleTimeString()
          }]);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('xentaricode-snippets');
    if (stored) {
      setSavedSnippets(JSON.parse(stored));
    }
  }, []);

  const saveSnippet = () => {
    if (!snippetName.trim()) {
      alert('Please enter a name for your snippet');
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
    
    const updatedSnippets = [snippet, ...savedSnippets];
    setSavedSnippets(updatedSnippets);
    localStorage.setItem('xentaricode-snippets', JSON.stringify(updatedSnippets));
    setSnippetName('');
    setShowSaveModal(false);
    alert('Snippet saved successfully!');
  };

  const loadSnippet = (snippet) => {
    setHtml(snippet.html);
    setCss(snippet.css);
    setJs(snippet.js);
    setPreviewKey(prev => prev + 1);
  };

  const deleteSnippet = (id) => {
    const updated = savedSnippets.filter(s => s.id !== id);
    setSavedSnippets(updated);
    localStorage.setItem('xentaricode-snippets', JSON.stringify(updated));
  };

  const shareCode = () => {
    const data = { html, css, js };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    navigator.clipboard.writeText(url);
    alert('Share URL copied to clipboard!');
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
        console.error('Failed to load shared code');
      }
    }
  }, []);

  const downloadProject = () => {
    const content = getCombinedHtml();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'xentaricode-project.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetToTemplate = () => {
    setHtml(`<!DOCTYPE html>
<html>
<head>
    <title>New Project</title>
</head>
<body>
    <div class="container">
        <h1>Hello World!</h1>
        <button id="clickMeBtn">Click Me</button>
        <div id="messageBox" class="message-box"></div>
    </div>
</body>
</html>`);
    setCss(`body {
    font-family: Arial, sans-serif;
    margin: 40px;
    background: #f0f0f0;
    text-align: center;
}

.container {
    background: white;
    padding: 40px;
    border-radius: 10px;
}

button {
    padding: 10px 20px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
}

button:hover {
    background: #764ba2;
}

.message-box {
    margin-top: 20px;
    padding: 10px;
    border-radius: 5px;
    display: none;
}

.message-box.show {
    display: block;
}

.message-box.success {
    background: #d4edda;
    color: #155724;
}`);
    setJs(`document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('clickMeBtn');
    const messageBox = document.getElementById('messageBox');
    
    function showMessage(text) {
        if (messageBox) {
            messageBox.textContent = text;
            messageBox.className = 'message-box show success';
            setTimeout(() => {
                messageBox.classList.remove('show');
            }, 2000);
        }
    }
    
    if (button) {
        button.onclick = function() {
            alert('Hello from XentariCode!');
            showMessage('Button clicked!');
        };
    }
});`);
  };

  return (
    <div className="app">
      <Toolbar
        layout={layout}
        setLayout={setLayout}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        setShowConsole={setShowConsole}
        showConsole={showConsole}
        setShowSaveModal={setShowSaveModal}
        onDownload={downloadProject}
        onShare={shareCode}
        onReset={resetToTemplate}
      />
      
      <div className="file-tabs">
        <button 
          onClick={() => setActiveFile('html')} 
          className={`tab ${activeFile === 'html' ? 'active' : ''}`}
        >
          HTML
        </button>
        <button 
          onClick={() => setActiveFile('css')} 
          className={`tab ${activeFile === 'css' ? 'active' : ''}`}
        >
          CSS
        </button>
        <button 
          onClick={() => setActiveFile('js')} 
          className={`tab ${activeFile === 'js' ? 'active' : ''}`}
        >
          JavaScript
        </button>
      </div>
      
      <div className="main-content">
        {layout !== 'preview-only' && (
          <div className={`editor-section ${layout === 'side-by-side' ? 'split' : 'full'}`}>
            <CodeEditor
              html={html}
              setHtml={setHtml}
              css={css}
              setCss={setCss}
              js={js}
              setJs={setJs}
              theme={theme}
              fontSize={fontSize}
              activeFile={activeFile}
            />
          </div>
        )}
        
        {layout !== 'editor-only' && (
          <div className={`preview-section ${layout === 'side-by-side' ? 'split' : 'full'}`}>
            <LivePreview 
              ref={iframeRef}
              html={html}
              css={css}
              js={js}
              onRefresh={() => setPreviewKey(prev => prev + 1)}
            />
          </div>
        )}
      </div>
      
      {showConsole && (
        <ConsolePanel 
          consoleOutput={consoleOutput} 
          setConsoleOutput={setConsoleOutput} 
        />
      )}
      
      <SnippetsPanel 
        savedSnippets={savedSnippets} 
        onLoad={loadSnippet} 
        onDelete={deleteSnippet} 
      />
      
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Save Your Code</h3>
            <input
              type="text"
              placeholder="Enter a name for your snippet"
              value={snippetName}
              onChange={(e) => setSnippetName(e.target.value)}
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  saveSnippet();
                }
              }}
            />
            <div className="modal-actions">
              <button onClick={saveSnippet} className="save-btn">Save</button>
              <button onClick={() => setShowSaveModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default App;