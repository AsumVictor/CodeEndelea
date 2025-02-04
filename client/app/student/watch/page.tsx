"use client";

import { useEffect, useRef, useState } from "react";
import VideoPlayer from "../../../components/watch_video/VideoPlayer";
import CodeSpace from "../../../components/editorStudio/index";
import Hls from "hls.js";

// Demo data
const videoSources = [
  {
    name: "HLS with fallback",
    url: "https://download.samplelib.com/mp4/sample-30s.mp4",
    url2: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  },
  {
    name: "MP4 only",
    url: "https://download.samplelib.com/mp4/sample-30s.mp4",
  },
  {
    name: "HLS not supported (fallback to MP4)",
    url: "https://download.samplelib.com/mp4/sample-30s.mp4",
    url2: "https://example.com/video.m3u8", // This URL doesn't exist, so it will fall back to url
  },
];

export default function Home() {
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
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="absolute top-0 left-0 z-[9999] h-full w-full ">
        {/* <VideoPlayer
          url={selectedSource.url}
          url2={
            "https://codeendelea.s3.eu-north-1.amazonaws.com/hls/67a1cfa272c90a645d3f97b9/screen_643472849516.webm_master.m3u8"
          }
        /> */}
      </div>
      <CodeSpace />
    </div>
  );
}
