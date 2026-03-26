import React, { forwardRef, useRef, useEffect } from 'react';
import './LivePreview.css';

const LivePreview = forwardRef(({ html, css, js, onRefresh }, ref) => {
  const iframeRef = ref;
  const popoutWindowRef = useRef(null);

  // Function to create HTML for preview
  const generateFullHtml = (isPopup = false) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * {
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
        max-width: 500px;
        width: 100%;
      }
      h1 {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 16px;
      }
      p {
        color: #666;
        margin-bottom: 24px;
      }
      .demo-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 32px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
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
        display: none;
      }
      .message-box.show {
        display: block;
      }
      .message-box.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }
    </style>
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>
      // Simple button handler that works in both main and popup windows
      (function() {
        function init() {
          var button = document.getElementById('clickMeBtn');
          var messageBox = document.getElementById('messageBox');
          
          if (button) {
            button.onclick = function(e) {
              e.preventDefault();
              // This alert will show in the current window (popup or main)
              alert('Hello from XentariCode!');
              
              if (messageBox) {
                messageBox.textContent = '✨ Button clicked successfully! Welcome to XentariCode.';
                messageBox.className = 'message-box success show';
                setTimeout(function() {
                  messageBox.className = 'message-box';
                }, 3000);
              }
            };
          }
        }
        
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', init);
        } else {
          init();
        }
      })();
    </script>
    <script>${js}</script>
</body>
</html>`;
  };

  // Update iframe content
  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(generateFullHtml(false));
        iframeDoc.close();
      }
    }
  }, [html, css, js]);

  const handleRefresh = () => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(generateFullHtml(false));
        iframeDoc.close();
      }
    }
    if (onRefresh) onRefresh();
  };

  const handlePopout = () => {
    // Open new independent window
    const newWindow = window.open('', 'XentariCode_Popup', 'width=1000,height=700,resizable=yes,scrollbars=yes,menubar=yes,toolbar=yes');
    
    if (newWindow) {
      // Write HTML directly to the new window
      newWindow.document.open();
      newWindow.document.write(generateFullHtml(true));
      newWindow.document.close();
      popoutWindowRef.current = newWindow;
      
      // Focus the popup window
      newWindow.focus();
    }
  };

  return (
    <div className="live-preview-container">
      <div className="preview-header">
        <div className="preview-title">
          <span className="preview-icon">●</span>
          <span>Live Preview</span>
        </div>
        <div className="preview-actions">
          <button onClick={handleRefresh} className="refresh-btn">
            Refresh
          </button>
          <button onClick={handlePopout} className="popout-btn">
            Popout
          </button>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        title="live-preview"
        className="preview-frame"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
      />
    </div>
  );
});

export default LivePreview;