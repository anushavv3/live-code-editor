import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

const JSEditor = ({ value, onChange, theme, fontSize }) => {
  const editorRef = useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setTimeout(() => editor.layout(), 100);
    window.addEventListener('resize', () => setTimeout(() => editor.layout(), 100));
  };

  return (
    <div className="editor-wrapper">
      <Editor
        height="100%"
        language="javascript"
        value={value}
        onChange={(value) => onChange(value || '')}
        theme={theme}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: isMobile ? Math.max(12, fontSize - 2) : fontSize,
          wordWrap: 'on',
          lineNumbers: isMobile ? 'off' : 'on',
          automaticLayout: true,
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
          renderWhitespace: 'boundary',
          folding: !isMobile,
          glyphMargin: !isMobile,
          lineDecorationsWidth: isMobile ? 0 : undefined,
          lineNumbersMinChars: isMobile ? 2 : 5,
          renderLineHighlight: isMobile ? 'none' : 'line',
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: isMobile,
          scrollbar: {
            vertical: isMobile ? 'auto' : 'visible',
            horizontal: isMobile ? 'auto' : 'visible',
            useShadows: false,
            verticalScrollbarSize: isMobile ? 8 : 12,
            horizontalScrollbarSize: isMobile ? 8 : 12
          }
        }}
      />
    </div>
  );
};

export default JSEditor;