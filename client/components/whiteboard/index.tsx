"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2, Hand, HelpCircle } from "lucide-react";
import { FloatingTools } from "./floating-tools";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { setColor, setContent, setSize, setTool } from "@/redux/slices/whiteBoard";

export default function CanvasEditor() {
  const dispatch = useDispatch();
  const { tool, color, size, content } = useSelector(
    (state: RootState) => state.canvasEditor
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  // const [tool, setTool] = useState<string>("draw");
  // const [color, setColor] = useState<string>("#000000");
  // const [size, setSize] = useState<number>(2);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#ffffff",
        isDrawingMode: true,
      });

      // dispatch(setCanvas(fabricCanvas));
      setCanvas(fabricCanvas);

      const updateObjects = () => {
        dispatch(setContent(fabricCanvas.toJSON()))
      };

      // Listen to object addition, modification, and removal events
      fabricCanvas.on("object:added", updateObjects);
      fabricCanvas.on("object:modified", updateObjects);
      fabricCanvas.on("object:removed", updateObjects);

      fabricCanvas.on("mouse:down", handleCanvasMouseDown);

      const handleResize = () => {
        fabricCanvas.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        fabricCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (!canvas) return;

    canvas.isDrawingMode = tool === "draw";
    canvas.selection = tool !== "draw";

    if (tool === "draw" && canvas.freeDrawingBrush) {
      // Set the brush properties if the tool is 'draw'
      canvas.freeDrawingBrush.width = size;
      canvas.freeDrawingBrush.color = "red";
    }

    // Disable selection of individual objects when in drawing mode
    canvas.forEachObject((obj) => {
      obj.selectable = !canvas.isDrawingMode;
    });

    canvas.renderAll();
  }, [tool, color, size, canvas]);

  const addShape = (
    type: "rectangle" | "circle",
    position?: { x: number; y: number }
  ) => {
    if (!canvas) return;

    const options = {
      left: position?.x ?? 100,
      top: position?.y ?? 100,
      fill: "transparent",
      stroke: color,
      strokeWidth: size,
    };

    const shape =
      type === "rectangle"
        ? new fabric.Rect({ ...options, width: 100, height: 100 })
        : new fabric.Circle({ ...options, radius: 50 });

    canvas.add(shape);
    canvas.renderAll();
  };

  const addText = (position?: { x: number; y: number }) => {
    if (!canvas) return;
    const text = new fabric.IText("Double click to edit", {
      left: position?.x ?? 100,
      top: position?.y ?? 100,
      fontSize: size * 10,
      fill: color,
    });
    canvas.add(text);
    canvas.renderAll();
  };

  const handleCanvasMouseDown = (event: fabric.TEvent) => {
    if (tool !== "draw") {
      const pointer = canvas?.getPointer(event.e);
      if (pointer) {
        if (tool === "rectangle") addShape("rectangle", pointer);
        if (tool === "circle") addShape("circle", pointer);
        if (tool === "text") addText(pointer);
      }
    }
  };

  const handleToolSelect = (selectedTool: string) => {
    dispatch(setTool(selectedTool));
    if (selectedTool === "rectangle") addShape("rectangle");
    if (selectedTool === "circle") addShape("circle");
    if (selectedTool === "text") addText();
    // No need for a special case for 'draw' as it's handled in the useEffect
  };

  const handleColor = (n: string) => {
    dispatch(setColor(n));
  };

  const handleSize = (n: number) => {
    dispatch(setSize(n));
  };


  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Main Canvas */}
      <div className="flex-1 relative"></div>
      <canvas ref={canvasRef} />

      <FloatingTools
        onSelectTool={handleToolSelect}
        onColorChange={handleColor}
        onSizeChange={handleSize}
        selectedTool={tool}
        color={color}
        size={size}
      />
      {/* Bottom Controls */}
      <div className="h-12 absolute self-center top-1 rounded-xl bg-[#0a0a0f] border-t border-gray-800 flex items-center px-4 gap-4 w-9/12">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="h-6 w-px bg-gray-800" />
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <Hand className="h-4 w-4" />
        </Button>
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
