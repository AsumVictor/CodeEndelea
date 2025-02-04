// features/codeEditorSlice.ts
import { EditorState, ExecutionResult } from "@/components/types/editor";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface editor {
  code: string;
  language: string;
  theme: string;
  fontSize: number;
  terminalHeight: number;
  isTerminalVisible: boolean;
  output: string;
  error: string | null;
  executionResult: ExecutionResult | null;
  isRunning: boolean;
}

const initialState: editor = {
  code: "",
  language: "javascript",
  theme: "vs-dark",
  fontSize: 14,
  terminalHeight: 300,
  isTerminalVisible: false,
  output: "",
  error: "",
  executionResult: null,
  isRunning: false,
};

const codeEditorSlice = createSlice({
  name: "codeEditor",
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload;
    },
    setTerminalHeight: (state, action: PayloadAction<number>) => {
      state.terminalHeight = action.payload;
    },
    toggleTerminal: (state) => {
      state.isTerminalVisible = !state.isTerminalVisible;
    },
    setTerminal: (state, action: PayloadAction<boolean>) => {
      state.isTerminalVisible = action.payload;
    },
    setOutput: (state, action: PayloadAction<string>) => {
      state.output = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setExecutionResult: (
      state,
      action: PayloadAction<ExecutionResult | null>
    ) => {
      state.executionResult = action.payload;
    },
    setIsRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
    },

    setEditorStateTo: (state, action: PayloadAction<editor>) => {
      state.code = action.payload.code;
      state.language = action.payload.language;
      state.theme = action.payload.theme;
      state.fontSize = action.payload.fontSize;
      state.terminalHeight = action.payload.terminalHeight;
      state.isTerminalVisible = action.payload.isTerminalVisible;
      state.output = action.payload.output;
      state.error = action.payload.error;
      state.executionResult = action.payload.executionResult;
      state.isRunning = action.payload.isRunning;
    },
  },
});

export const {
  setCode,
  setLanguage,
  setTheme,
  setFontSize,
  setTerminalHeight,
  toggleTerminal,
  setOutput,
  setError,
  setExecutionResult,
  setIsRunning,
  setTerminal,
  setEditorStateTo,
} = codeEditorSlice.actions;

export default codeEditorSlice.reducer;
