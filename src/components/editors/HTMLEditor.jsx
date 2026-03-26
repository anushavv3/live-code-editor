import React from 'react';
import Editor from '@monaco-editor/react';

const HTMLEditor = ({ value, onChange, theme, fontSize }) => {
  return (
    <div className="editor-wrapper">
      <Editor
        height="100%"
        language="html"
        value={value}
        onChange={(value) => onChange(value || '')}
        theme={theme}
        options={{
          minimap: { enabled: false },
          fontSize: fontSize,
          wordWrap: 'on',
          lineNumbers: 'on',
          automaticLayout: true,
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
          renderWhitespace: 'boundary'
        }}
      />
    </div>
  );
};

export default HTMLEditor;