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
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  setCode,
  setError,
  setExecutionResult,
  setFontSize,
  setIsRunning,
  setLanguage,
  setOutput,
  setTerminal,
  setTerminalHeight,
  setTheme,
  toggleTerminal,
} from "@/redux/slices/EditorSlices";
import { RootState } from "@/redux/Store";

const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24];

export default function CodeEditor() {
  const dispatch = useDispatch();
  const {
    code,
    language,
    theme,
    fontSize,
    isTerminalVisible,
    output,
    error,
    isRunning,
    terminalHeight,
  } = useSelector((state: RootState) => state.codeEditor);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

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
      dispatch(setError("Please enter some code"));
      return;
    }

    dispatch(setIsRunning(true));
    dispatch(setError(null));
    dispatch(setOutput(""));
    dispatch(setTerminal(true));

    try {
      const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
      console.log(runtime);
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
        dispatch(setError(data.message));
        dispatch(setExecutionResult({ code, output: "", error: data.message }));
        return;
      }

      if (data.compile && data.compile.code !== 0) {
        const compileError = data.compile.stderr || data.compile.output;
        dispatch(setError(compileError));
        dispatch(setExecutionResult({ code, output: "", error: compileError }));
        return;
      }

      if (data.run && data.run.code !== 0) {
        const runtimeError = data.run.stderr || data.run.output;
        dispatch(setError(runtimeError));
        dispatch(setExecutionResult({ code, output: "", error: runtimeError }));
        return;
      }

      const outputResult = data.run.output;
      dispatch(setOutput(outputResult.trim()));
      dispatch(
        setExecutionResult({ code, output: outputResult.trim(), error: null })
      );
    } catch (err) {
      console.error("Error running code:", err);
      dispatch(setError("Error running code"));
      dispatch(
        setExecutionResult({ code, output: "", error: "Error running code" })
      );
    } finally {
      dispatch(setIsRunning(false));
    }
  };

  const handleTerminalHeightChange = (height: number) => {
    dispatch(setTerminalHeight(height));
  };

  const handleLanguageChange = (language: string) => {
    dispatch(setLanguage(language));
    dispatch(setCode(LANGUAGE_CONFIG[language].defaultCode));
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
              <Select value={language} onValueChange={handleLanguageChange}>
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
                        {language == lang && (
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
                value={theme}
                onValueChange={(value) => dispatch(setTheme(value))}
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
                value={fontSize.toString()}
                onValueChange={(value) =>
                  dispatch(setFontSize(Number.parseInt(value)))
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
                        {fontSize == size && (
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
                onClick={() => {
                  dispatch(toggleTerminal());
                }}
                className={
                  isTerminalVisible
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
              defaultLanguage={LANGUAGE_CONFIG[language].monacoLanguage}
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              value={code}
              theme={theme}
              options={{
                fontSize: fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontFamily: "JetBrains Mono, monospace",
                padding: { top: 20 },
              }}
              onChange={(value) => dispatch(setCode(value || ""))}
              onMount={handleEditorDidMount}
              className="border-gray-700"
            />
          </div>
        </div>
      </div>

      <Terminal
        isVisible={isTerminalVisible}
        height={terminalHeight}
        output={output}
        error={error}
        isRunning={isRunning}
        onToggle={() => {
          dispatch(toggleTerminal());
        }}
        onHeightChange={handleTerminalHeightChange}
        onClose={() => dispatch(setTerminal(false))}
      />
    </div>
  );
}
