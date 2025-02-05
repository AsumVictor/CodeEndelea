"use client";

import type React from "react";


interface VideoPlayerProps {
  url: string;
  url2?: string;
}

const VideoPlayer = ({
  videoRef,
  handleTimeUpdate,
  handleLoadedMetadata,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg  p-0">
      <div className=" absolute bg-black bg-opacity-50 backdrop-blur-sm top-0 left-0 h-full w-full">
        <video
          ref={videoRef}
          className="w-full"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
