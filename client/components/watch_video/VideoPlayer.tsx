"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
  url: string;
  url2?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, url2 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const useHls = url2 && url2.endsWith(".m3u8") && Hls.isSupported();

    if (useHls) {
      const hls = new Hls({
        xhrSetup: function (xhr) {
          xhr.withCredentials = false; // Ensure this is false
        },
      });
      hls.loadSource(url2);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => setIsPlaying(false));
      });
    } else {
      video.src = url;
      video.load();
      video.play().catch(() => setIsPlaying(false));
    }

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("play", () => setIsPlaying(true));
    video.addEventListener("pause", () => setIsPlaying(false));

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("play", () => setIsPlaying(true));
      video.removeEventListener("pause", () => setIsPlaying(false));
    };
  }, [url, url2]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video) {
      const time = (Number.parseFloat(e.target.value) / 100) * video.duration;
      video.currentTime = time;
      setProgress(Number.parseFloat(e.target.value));
    }
  };

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
      <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="text-white hover:text-gray-300 transition-colors duration-300"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <input
            title="input"
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full mx-4 accent-white"
          />
          <div className="flex items-center">
            <button
              onClick={toggleMute}
              className="text-white hover:text-gray-300 transition-colors duration-300 mr-2"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              title="input"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 accent-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
