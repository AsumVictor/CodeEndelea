export interface EditorState {
    code: string
    language: string
    theme: string
    fontSize: number
    terminalHeight: number
    isTerminalVisible: boolean
    lastOutput?: {
      output: string
      error: string | null
      timestamp: number
    }
  }
  
  export interface ExecutionResult {
    code: string
    output: string
    error: string | null
  }
  
  export interface LanguageConfig {
    [key: string]: {
      pistonRuntime: {
        language: string
        version: string
      }
      monacoLanguage: string,
      defaultCode: string
    }
  }
  
  export interface ThemeOption {
    label: string
    value: string
    preview: string
  }
  
  