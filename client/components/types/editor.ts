export interface EditorState {
  code: string;
  language: string;
  theme: string;
  fontSize: number;
  terminalHeight: number;
  isTerminalVisible: boolean;
  lastOutput?: {
    output: string;
    error: string | null;
    timestamp: number;
  };
}

export interface ExecutionResult {
  code: string;
  output: string;
  error: string | null;
}

export interface LanguageConfig {
  [key: string]: {
    pistonRuntime: {
      language: string;
      version: string;
    };
    monacoLanguage: string;
    defaultCode: string;
  };
}

export interface ThemeOption {
  label: string;
  value: string;
  preview: string;
}

export interface codeSpace {
  vid_id: String;
}

export interface VideoMetaData {
  _id: string
  title: string;
  description: string;
  length: number;
  exercise_timestamps: number[];
  screen_url: string;
  camera_url: string;
  screen_hsl_url: string;
  camera_hsl_url: string;
  reactions: [number];
  is_publish: boolean;
}
