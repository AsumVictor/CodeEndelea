"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  FastForward,
  Pause,
  Play,
  Rewind,
  Settings,
  Volume2,
  Maximize,
} from "lucide-react";

interface VideoControlsProps {
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  isPlaying: boolean;
  currentTime: number;
}

export default function VideoControls({
  duration,
  onPlayPause,
  onSeek,
  isPlaying,
  currentTime,
}: VideoControlsProps) {
  const [volume, setVolume] = useState(100);
  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="z-[9999] absolute bottom-0 left-0 right-0 backdrop-blur-md bg-black/20 border-t border-white/10 p-4">
      <div className="flex flex-col gap-2">
        {/* Progress bar */}
        <div className="flex items-center gap-2 text-white text-sm">
          <span>{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={(value) => onSeek(value[0])}
            className="flex-1 cursor-pointer [&>span]:h-2 [&>span]:bg-white/20 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-purple-600 [&_[role=slider]]:bg-purple-600 [&>span:first-child_span]:bg-purple-600 [&_[role=slider]:hover]:bg-purple-600 [&_[role=slider]]:backdrop-blur-sm [&_[role=slider]]:shadow-sm"
          />
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-[2cm] justify-center">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10 transition-colors rounded-full backdrop-blur-sm"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Slider
              value={[volume]}
              max={100}
              onValueChange={(value) => setVolume(value[0])}
              className="w-20 [&>span]:h-1 [&>span]:bg-white/20 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-white/50 [&_[role=slider]]:bg-white/80 [&>span:first-child_span]:bg-white [&_[role=slider]:hover]:bg-white [&_[role=slider]]:backdrop-blur-sm [&_[role=slider]]:shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10 transition-colors rounded-full backdrop-blur-sm"
            >
              <Rewind className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 bg-purple-500 text-white hover:bg-white/10 transition-colors rounded-full backdrop-blur-sm"
              onClick={onPlayPause}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10 transition-colors rounded-full backdrop-blur-sm"
            >
              <FastForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10 transition-colors rounded-full backdrop-blur-sm"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10 transition-colors rounded-full backdrop-blur-sm"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
