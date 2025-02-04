"use client";

import { useEffect, useRef, useState } from "react";
import VideoPlayer from "../../../components/watch_video/VideoPlayer";
import CodeSpace from "../../../components/editorStudio/index";
import Hls from "hls.js";
import { VideoMetaData } from "@/components/types/editor";
import axios from "axios";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useDispatch } from "react-redux";
import { CanvasEditorState, setCanvasStateTo } from "@/redux/slices/whiteBoard";
import { editor, setEditorStateTo } from "@/redux/slices/EditorSlices";
import { setScreenStateTo, SplitScreenState } from "@/redux/slices/SplitScreen";
import { motion } from "framer-motion";

export default function Home({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetaData>();
  const videoCamRef = useRef<HTMLVideoElement>(null);

  // reduce
  const dispatch = useDispatch();

  // url of page:
  const { id } = searchParams;

  useEffect(() => {
    const video = videoRef.current;
    const cam = videoCamRef.current;
    if (!video || !videoMetadata || !cam) return;

    const useHls =
      videoMetadata.screen_hsl_url &&
      videoMetadata.camera_hsl_url &&
      Hls.isSupported();

    if (useHls) {
      const hls = new Hls({
        xhrSetup: function (xhr) {
          xhr.withCredentials = false;
        },
      });
      const camhls = new Hls({
        xhrSetup: function (xhr) {
          xhr.withCredentials = false;
        },
      });
      hls.loadSource(videoMetadata.screen_hsl_url);
      camhls.loadSource(videoMetadata.camera_hsl_url);
      hls.attachMedia(video);
      camhls.attachMedia(cam);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => setIsPlaying(false));
        cam.play().catch(() => setIsPlaying(false));
      });
    } else {
      video.src = videoMetadata.screen_url;
      video.load();
      video.play().catch(() => setIsPlaying(false));
      cam.src = videoMetadata.camera_url;
      cam.load();
      cam.play().catch(() => setIsPlaying(false));
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
  }, [videoMetadata]);

  const togglePlay = () => {
    const video = videoRef.current;
    const cam = videoCamRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
        cam && cam.pause();
      } else {
        video.play();
        cam && cam.play();
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

  useEffect(() => {
    const getVideoData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8082/api/v1/watch/${id}`
        );
        const video: VideoMetaData = response.data;
        if (!video) {
          throw new Error("Failed to fetch");
        }

        setVideoMetadata(video);
      } catch (error) {
        console.error(error);
      }
    };
    getVideoData();
  }, []);

  // fetch code when video pause
  useEffect(() => {
    const video = videoRef.current;

    if (isPlaying || !video) return;

    const getCode = async () => {
      try {
        const current_time = Math.floor(video.currentTime);

        const {
          data,
        }: {
          data: {
            canvas_state: CanvasEditorState;
            editor_state: editor;
            screen_state: SplitScreenState;
          };
        } = await axios.get(
          `http://localhost:8081/api/v1/code?vid_id=${id}&time_stamp=${current_time}`
        );

        dispatch(setScreenStateTo(data.screen_state));
        dispatch(setEditorStateTo(data.editor_state));
        dispatch(setCanvasStateTo(data.canvas_state));
      } catch (error) {
        console.error(error);
      }
    };
    getCode();
  }, [isPlaying]);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div
        className={`absolute top-0 left-0 h-full w-full ${
          isPlaying ? "z-[9999]" : "z-[0]"
        }`}
      >
        <VideoPlayer videoRef={videoRef} togglePlay={togglePlay} />
      </div>
      <CodeSpace />

      <div className="absolute z-[99999] bottom-0 left-0 right-0 px-4 py-2 bg-black bg-opacity-50 backdrop-blur-sm">
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

      {/* Drag of video tutorials */}
      <motion.div
        drag
        dragMomentum={false}
        initial={{ x: 100, y: 100 }}
        className="absolute z-[9999] flex flex-col border-4 border-green-500 w-[8cm] h-[8cm] bg-red-400 rounded-full overflow-hidden cursor-grab"
        style={{ touchAction: "none" }}
      >
        <video
          ref={videoCamRef}
          className="w-full h-full rounded-full object-cover"
          playsInline
        />
      </motion.div>
    </div>
  );
}
