"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pencil, Type, Circle, Square, Minus, Plus } from "lucide-react";
import { ColorPicker } from "./color-picker";

interface FloatingToolsProps {
  onSelectTool: (tool: string) => void;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  selectedTool: string;
  color: string;
  size: number;
}

export function FloatingTools({
  onSelectTool,
  onColorChange,
  onSizeChange,
  selectedTool,
  color,
  size,
}: FloatingToolsProps) {
  const tools = [
    { icon: Pencil, name: "draw", label: "Draw" },
    { icon: Type, name: "text", label: "Text" },
    { icon: Circle, name: "circle", label: "Circle" },
    { icon: Square, name: "rectangle", label: "Rectangle" },
  ];

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: 100, y: 100 }}
      className="absolute z-50 flex flex-col gap-3 p-3 bg-[#0a0a0f] shadow-lg border border-gray-800 rounded-xl"
      style={{ touchAction: "none" }}
    >
      <div className="flex flex-col gap-2">
        {tools.map((Tool) => (
          <Button
            key={Tool.name}
            variant="ghost"
            className={`flex gap-2 justify-start text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl ${
              selectedTool === Tool.name ? "bg-gray-800 text-white" : ""
            }`}
            onClick={() => onSelectTool(Tool.name)}
          >
            <Tool.icon className="h-5 w-5" />
            <span className="text-sm">{Tool.label}</span>
          </Button>
        ))}
      </div>

      <div className="h-px bg-gray-800" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Color</span>
          <ColorPicker color={color} onChange={onColorChange} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Size</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onSizeChange(Math.max(1, size - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="w-20">
              <Slider
                value={[size]}
                onValueChange={(values) => onSizeChange(values[0])}
                min={1}
                max={20}
                step={1}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onSizeChange(Math.min(20, size + 1))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
