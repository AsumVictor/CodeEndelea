import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  Maximize2,
  Minimize2,
  TerminalIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { MdReportGmailerrorred } from "react-icons/md";
import { HiMiniCheckBadge } from "react-icons/hi2";

interface TerminalProps {
  isVisible: boolean;
  height: number;
  output: string;
  error: string | null;
  isRunning: boolean;
  onToggle: () => void;
  onHeightChange: (height: number) => void;
  onClose: () => void;
}

export function Terminal({
  isVisible,
  height,
  output,
  error,
  isRunning,
  onToggle,
  onHeightChange,
  onClose,
}: TerminalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(height);
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(height);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const delta = startY - e.clientY;
      const newHeight = Math.min(
        Math.max(startHeight + delta, 150),
        window.innerHeight * 0.8
      );
      onHeightChange(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startY, startHeight, onHeightChange]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={terminalRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className=" absolute bottom-0 left-0 right-0 bg-[#0a0a0f] border-t border-gray-700 overflow-hidden"
        >
          <div
            className="h-1 w-full cursor-ns-resize bg-gradient-to-r from-blue-500/50 to-purple-500/50"
            onMouseDown={handleMouseDown}
          />
          <div className="px-4 py-3 flex items-center justify-between border-b border-purple-500">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onToggle}>
                {isVisible ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
              <span className="text-sm font-medium text-gray-300 flex flow-row items-center">
                <TerminalIcon />
                Terminal
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onHeightChange(height === 300 ? 500 : 300)}
              >
                {height > 300 ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            className="p-4 font-mono text-sm overflow-auto"
            style={{ height: `calc(${height}px - 57px)` }}
          >
            {isRunning ? (
              <div className="flex items-center space-x-2 text-blue-400">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                <span>Running code...</span>
              </div>
            ) : error ? (
              <>
                <p className=" text-xl flex  items-center gap-2 mb-2 text-red-600 font-semibold">
                  <MdReportGmailerrorred />
                  <span>Code did not run successfuly</span>
                </p>
                <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
              </>
            ) : output ? (
              <>
                <p className=" text-xl flex  items-center gap-2 mb-2 text-emerald-600 font-semibold">
                  <HiMiniCheckBadge />
                  <span>Code run successfuly</span>
                </p>
                <pre className="text-emerald-600 whitespace-pre-wrap">
                  {error}
                </pre>
              </>
            ) : (
              <p className="text-gray-400">Ready to run code...</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
