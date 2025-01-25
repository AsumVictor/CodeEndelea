"use client";

import type React from "react";
import { useSplitScreen } from "../../hooks/useSplitScreen";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MdOutlineDragIndicator } from "react-icons/md";

export const SplitScreen = ({
  LeftPage,
  RightPage,
}: {
  LeftPage: JSX.Element;
  RightPage: JSX.Element;
}) => {
  const {
    splitPosition,
    isDragging,
    leftVisible,
    rightVisible,
    handleMouseDown,
    toggleLeft,
    toggleRight,
    showScreens,
  } = useSplitScreen();

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {(leftVisible || !rightVisible) && (
        <div
          className="h-full relative"
          style={{ width: rightVisible ? `${splitPosition}%` : "100%" }}
        >
          {LeftPage}
          <Button
            className="absolute top-2 right-2
            bg-gradient-to-b from-blue-500/50 to-purple-500/50
             rounded-[8px] font-extrabold border-white/50
              opacity-30 text-white
              hover:opacity-100
             transition-all
             z-[999]
            "
            variant="outline"
            size="icon"
            onClick={() => {
              if (!rightVisible) {
                return showScreens();
              }
              toggleLeft();
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
      )}
      {leftVisible && rightVisible && (
        <div
          className={`h-full z-[999] relative overflow-visible flex justify-center items-center w-[0.15cm] bg-gradient-to-b from-blue-500/50 to-purple-500/50  cursor-col-resize ${
            isDragging
              ? "hover:bg-gradient-to-b hover:from-blue-500 hover:to-purple-500"
              : ""
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="bg-purple-500 py-3 absolute self-center flex justify-center items-center w-[.5cm] rounded-xl">
            <MdOutlineDragIndicator />
          </div>
        </div>
      )}
      {(rightVisible || !leftVisible) && (
        <div
          className="h-full  relative"
          style={{ width: leftVisible ? `${100 - splitPosition}%` : "100%" }}
        >
          {RightPage}

          <Button
            className="absolute top-2 left-2
            bg-gradient-to-b from-blue-500/50 to-purple-500/50
             rounded-[8px] font-extrabold border-white/50
              opacity-50 text-white
              hover:opacity-100
             transition-all
             z-[999]
            "
            variant="outline"
            size="icon"
            onClick={() => {
              if (!leftVisible) {
                return showScreens();
              }
              toggleRight();
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};
