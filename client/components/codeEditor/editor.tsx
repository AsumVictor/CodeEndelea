"use client";

import { useEffect, useRef, useState } from "react";
import type * as monaco from "monaco-editor";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code2, Play, Loader2, TerminalIcon, Blocks } from "lucide-react";
import axios from "axios";
import { Terminal } from "./terminal";
import { LANGUAGE_CONFIG } from "./config/languages";
import { THEME_OPTIONS } from "./config/themes";
import type { EditorState, ExecutionResult } from "../types/editor.ts";
import Link from "next/link";

const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24];

const DEFAULT_STATE: EditorState = {
  code: LANGUAGE_CONFIG.javascript.defaultCode,
  language: "javascript",
  theme: "vs-dark",
  fontSize: 14,
  terminalHeight: 300,
  isTerminalVisible: false,
};

export default function CodeEditor() {
  const [editorState, setEditorState] = useState<EditorState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("editorState");
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return DEFAULT_STATE;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    localStorage.setItem("editorState", JSON.stringify(editorState));
  }, [editorState]);

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;
  };

  const getCode = () => {
    return editorRef.current?.getValue() || "";
  };

  const handleRunCode = async () => {
    const code = getCode();

    if (!code) {
      setError("Please enter some code");
      return;
    }

    setIsRunning(true);
    setError(null);
    setOutput("");
    setEditorState((prev) => ({ ...prev, isTerminalVisible: true }));

    try {
      const runtime = LANGUAGE_CONFIG[editorState.language].pistonRuntime;
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language: runtime.language,
          version: runtime.version,
          files: [{ content: code }],
        }
      );

      const data = response.data;

      if (data.message) {
        setError(data.message);
        setExecutionResult({ code, output: "", error: data.message });
        return;
      }

      if (data.compile && data.compile.code !== 0) {
        const compileError = data.compile.stderr || data.compile.output;
        setError(compileError);
        setExecutionResult({ code, output: "", error: compileError });
        return;
      }

      if (data.run && data.run.code !== 0) {
        const runtimeError = data.run.stderr || data.run.output;
        setError(runtimeError);
        setExecutionResult({ code, output: "", error: runtimeError });
        return;
      }

      const outputResult = data.run.output;
      setOutput(outputResult.trim());
      setExecutionResult({ code, output: outputResult.trim(), error: null });

      setEditorState((prev) => ({
        ...prev,
        lastOutput: {
          output: outputResult.trim(),
          error: null,
          timestamp: Date.now(),
        },
      }));
    } catch (err) {
      console.error("Error running code:", err);
      setError("Error running code");
      setExecutionResult({ code, output: "", error: "Error running code" });
    } finally {
      setIsRunning(false);
    }
  };

  const toggleTerminal = () => {
    setEditorState((prev) => ({
      ...prev,
      isTerminalVisible: !prev.isTerminalVisible,
    }));
  };

  const handleTerminalHeightChange = (height: number) => {
    setEditorState((prev) => ({ ...prev, terminalHeight: height }));
  };

  const handleLanguageChange = (language: string) => {
    setEditorState((prev) => ({
      ...prev,
      language,
      code: LANGUAGE_CONFIG[language].defaultCode,
    }));
  };


  return (
    <div className="h-full w-full bg-[#0a0a0f]/80 overflow-hidden">
      <div className=" py-2 px-2 relative h-full w-full">
        <div className=" absolute left-0 right-0 z-[99] px-2 w-full">
          <header
            className=" h-[1.5cm] px-2 rounded-[10px] flex items-center justify-between -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
              "
          >
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center gap-3 group relative">
                {/* Logo hover effect */}

                <div
                  className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
                group-hover:opacity-100 transition-all duration-500 blur-xl"
                />

                {/* Logo */}
                <div
                  className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1
              ring-white/10 group-hover:ring-white/20 transition-all"
                >
                  <Code2 className="h-8 w-8 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
                </div>

                <div className="flex flex-col">
                  <span className="block text-lg font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                    CodeEndelea
                  </span>
                  <span className="block text-xs text-blue-400/60 font-medium">
                    Interactive video
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Select
                value={editorState.language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-[180px] bg-[#0a0a0f]/50 text-white hover:bg-[#0a0a0f]/90 transition-colors rounded-xl outline-none border-0 font-semibold">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0f] px-4 py-3 border-0 text-white rounded-xl flex flex-col gap-y-5 ">
                  {Object.keys(LANGUAGE_CONFIG).map((lang) => (
                    <SelectItem
                      className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-2 py-2 cursor-pointer my-2 rounded-xl"
                      key={lang}
                      value={lang}
                    >
                      {/* {lang.charAt(0).toUpperCase() + lang.slice(1)} */}
                      <div className=" flex flex-row items-center gap-2">
                        {editorState.language == lang && (
                          <div className=" h-[.3cm] w-[.3cm] rounded-full bg-emerald-700"></div>
                        )}
                        <div className="">
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={editorState.theme}
                onValueChange={(value) =>
                  setEditorState((prev) => ({ ...prev, theme: value }))
                }
              >
                <SelectTrigger className="w-[180px] bg-[#0a0a0f]/50 text-white hover:bg-[#0a0a0f]/90 transition-colors rounded-xl outline-none border-0 font-semibold">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0f] px-4 py-3 border-0 text-white rounded-xl flex flex-col gap-y-5">
                  {THEME_OPTIONS.map((theme) => (
                    <SelectItem
                      key={theme.value}
                      value={theme.value}
                      className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-2 py-2 cursor-pointer my-2 rounded-xl"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-600"
                          style={{ backgroundColor: theme.preview }}
                        />
                        <span>{theme.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={editorState.fontSize.toString()}
                onValueChange={(value) =>
                  setEditorState((prev) => ({
                    ...prev,
                    fontSize: Number.parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="w-[100px] bg-[#0a0a0f]/50 text-white hover:bg-[#0a0a0f]/90 transition-colors rounded-xl outline-none border-0 font-semibold">
                  <SelectValue placeholder="Font size" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0f] px-4 py-3 border-0 text-white rounded-xl flex flex-col gap-y-5 ">
                  {FONT_SIZES.map((size) => (
                    <SelectItem
                      className="
                  bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-2 py-2 cursor-pointer my-2 rounded-xl
                  "
                      key={size}
                      value={size.toString()}
                    >
                      <div className=" flex flex-row items-center gap-2">
                        {editorState.fontSize == size && (
                          <div className=" h-[.3cm] w-[.3cm] rounded-full bg-emerald-700"></div>
                        )}
                        <div className="">{size}px</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleTerminal}
                className={
                  editorState.isTerminalVisible
                    ? "bg-gray-700  rounded-[10px]"
                    : " rounded-[10px]"
                }
              >
                <TerminalIcon className="h-4 w-4" />
              </Button>

              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 rounded-[10px]"
              >
                {isRunning ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Run Code
              </Button>
            </div>
          </header>
        </div>
        <div className=" w-full h-full pt-[1.7cm] ">
          <div className="overflow-hidden border-2 border-gradient-to-r border-blue-500/20 rounded-[10px]  h-full">
            <Editor
              height="100%"
              defaultLanguage={
                LANGUAGE_CONFIG[editorState.language].monacoLanguage
              }
              language={LANGUAGE_CONFIG[editorState.language].monacoLanguage}
              value={editorState.code}
              theme={editorState.theme}
              options={{
                fontSize: editorState.fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontFamily: "JetBrains Mono, monospace",
                padding: { top: 20 },
              }}
              onChange={(value) =>
                setEditorState((prev) => ({ ...prev, code: value || "" }))
              }
              onMount={handleEditorDidMount}
              className="border-gray-700"
            />
          </div>
        </div>
      </div>

      <Terminal
        isVisible={editorState.isTerminalVisible}
        height={editorState.terminalHeight}
        output={output}
        error={error}
        isRunning={isRunning}
        onToggle={toggleTerminal}
        onHeightChange={handleTerminalHeightChange}
        onClose={() =>
          setEditorState((prev) => ({ ...prev, isTerminalVisible: false }))
        }
      />
    </div>
  );
}
