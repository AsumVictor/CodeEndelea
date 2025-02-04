"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
  url: string;
  url2?: string;
}

const VideoPlayer = ({
  videoRef,
  togglePlay,

}) => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg  p-0">
      <div className=" absolute bg-black bg-opacity-50 backdrop-blur-sm top-0 left-0 h-full w-full">
        <video
          ref={videoRef}
          className="w-full"
          onClick={togglePlay}
          playsInline
        />
      </div>

    </div>
  );
};

export default VideoPlayer;
