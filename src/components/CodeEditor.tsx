'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useRouter } from 'next/navigation';

type CodeEditorProps = {
  language: string;
  onCodeChange?: (code: string) => void;
}

// Map the user-friendly language name to Monaco Editor language ID
const languageMap: Record<string, string> = {
  'JavaScript': 'javascript',
  'TypeScript': 'typescript',
  'Python': 'python',
  'Java': 'java',
  'C++': 'cpp',
  'Go': 'go',
  'Rust': 'rust',
};

// Default code snippets by language
const defaultCode: Record<string, string> = {
  'javascript': '// JavaScript code\nfunction solution(input) {\n  // Your code here\n  return result;\n}\n',
  'typescript': '// TypeScript code\nfunction solution(input: any): any {\n  // Your code here\n  return result;\n}\n',
  'python': '# Python code\ndef solution(input):\n    # Your code here\n    return result\n',
  'java': '// Java code\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n\n    public static Object solution(Object input) {\n        // Your code here\n        return result;\n    }\n}\n',
  'cpp': '// C++ code\n#include <iostream>\nusing namespace std;\n\nint solution(int input) {\n    // Your code here\n    return result;\n}\n\nint main() {\n    // Test your solution\n    return 0;\n}\n',
  'go': '// Go code\npackage main\n\nimport "fmt"\n\nfunc solution(input interface{}) interface{} {\n    // Your code here\n    return result\n}\n\nfunc main() {\n    // Test your solution\n}\n',
  'rust': '// Rust code\nfn solution(input: i32) -> i32 {\n    // Your code here\n    return result;\n}\n\nfn main() {\n    // Test your solution\n}\n',
};

// Code editor themes
const editorThemes = [
  { label: 'Light', value: 'vs' },
  { label: 'Dark', value: 'vs-dark' },
  { label: 'High Contrast', value: 'hc-black' },
];

const CodeEditor: React.FC<CodeEditorProps> = ({ language, onCodeChange }) => {
  const [code, setCode] = useState<string>('');
  const [theme, setTheme] = useState<string>('vs-dark');
  const monacoLanguage = languageMap[language] || 'javascript';
  const router = useRouter();
  
  useEffect(() => {
    // Set the default code snippet based on the language
    const initial = defaultCode[monacoLanguage] || defaultCode['javascript'];
    setCode(initial);
    if (onCodeChange) onCodeChange(initial);
  }, [monacoLanguage]);

  // Handler for Monaco Editor's onMount event to fix resizing issues
  const handleEditorDidMount = (editor: any) => {
    // Add a window resize listener to ensure editor layout is updated
    const handleResize = () => {
      editor.layout();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Handle parent container resize (using ResizeObserver if available)
    if (typeof ResizeObserver !== 'undefined') {
      const editorElement = editor.getDomNode();
      if (editorElement && editorElement.parentElement) {
        const resizeObserver = new ResizeObserver(() => {
          editor.layout();
        });
        resizeObserver.observe(editorElement.parentElement);
        
        // Cleanup observer on unmount
        return () => {
          resizeObserver.disconnect();
          window.removeEventListener('resize', handleResize);
        };
      }
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      if (onCodeChange) onCodeChange(value);
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  return (
    <div className="flex flex-col w-full h-[94vh]">
      <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Coding Interview: {language}
          </h1>
          <select
            value={theme}
            onChange={handleThemeChange}
            className="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
          >
            {editorThemes.map((themeOption) => (
              <option key={themeOption.value} value={themeOption.value}>
                {themeOption.label} Theme
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
        </div>
      </div>

      <div className="flex-grow relative">
        <Editor
          height="100%"
          defaultLanguage={monacoLanguage}
          language={monacoLanguage}
          value={code}
          theme={theme}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            formatOnType: true,
            formatOnPaste: true,
            autoIndent: 'full',
            tabSize: 2,
            wordWrap: 'on',
            folding: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnCommitCharacter: true,
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true
            },
            suggestSelection: 'first',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoSurround: 'languageDefined',
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor; 