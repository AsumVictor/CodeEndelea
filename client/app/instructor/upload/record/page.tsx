"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Camera, XCircle, CheckCircle } from "lucide-react";
import { PermissionStatus } from "@/components/record/PermissionStatus";
import { useRouter } from "next/navigation";

const ScreenCameraRecorder = ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {
  const { id } = searchParams;
  const router = useRouter();

  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );

  const [isRecording, setIsRecording] = useState(false);
  let screenChunks: Blob[] = [];
  let cameraChunks: Blob[] = [];

  const screenStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraRecorderRef = useRef<MediaRecorder | null>(null);

  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);

  const [is_shown, setIsShown] = useState(false);

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: false,
      });

      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      screenStreamRef.current = screenStream;
      cameraStreamRef.current = cameraStream;

      if (screenVideoRef.current)
        screenVideoRef.current.srcObject = screenStream;
      if (cameraVideoRef.current)
        cameraVideoRef.current.srcObject = cameraStream;

      const screenRecorder = new MediaRecorder(screenStream);
      const cameraRecorder = new MediaRecorder(cameraStream);

      screenRecorderRef.current = screenRecorder;
      cameraRecorderRef.current = cameraRecorder;

      screenRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          screenChunks.push(event.data);
        }
      };

      cameraRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          cameraChunks.push(event.data);
        }
      };

      screenStream.getVideoTracks()[0].addEventListener("ended", () => {
        stopRecording();
        sendMessage(false);
      });

      screenRecorder.start();
      cameraRecorder.start();
      setIsRecording(true);
      sendMessage(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (screenRecorderRef.current) {
      screenRecorderRef.current.onstop = () => {
        saveRecording(
          [...screenChunks],
          `${generateRandomNumberString("screen_", 12)}`
        );
      };
      screenRecorderRef.current.stop();
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    }

    if (cameraRecorderRef.current) {
      cameraRecorderRef.current.onstop = () => {
        saveRecording(
          [...cameraChunks],
          `${generateRandomNumberString("camera_", 12)}`
        );
      };
      cameraRecorderRef.current.stop();
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    }

    setIsRecording(false);
    sendMessage(false);
    setIsShown(true);
  };

  const saveRecording = (chunks: Blob[], fileName: string) => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  };

  // Handle permission
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const micResult = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      setMicPermission(micResult.state === "granted");

      const cameraResult = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      setCameraPermission(cameraResult.state === "granted");
    } catch (error) {
      console.error("Error checking permissions:", error);
    }
  };

  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      checkPermissions();
    } catch (error) {
      console.error("Error requesting permissions:", error);
      setMicPermission(false);
      setCameraPermission(false);
    }
  };

  const sendMessage = (data: boolean) => {
    const name = id || "shared";
    localStorage.setItem(name, JSON.stringify({ message: data }));
  };

  useEffect(() => {
    window.addEventListener("storage", (event) => {
      if (event.key === "sharedData") {
        const newMessage = JSON.parse(event.newValue || "{}");
      }
    });

    return () => {
      window.removeEventListener("storage", () => {});
    };
  }, []);

  const generateRandomNumberString = (prefix: string, length: number) => {
    const randomNumber = Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, "0");
    return prefix + randomNumber;
  };

  return (
    <div className="relative h-screen flex justify-center items-center flex-col py-10">
      <h1>Screen & Camera Recorder</h1>
      <p>Record your screen and webcam separately and save both videos!</p>

      {/* Permission before */}
      <h1 className="text-3xl font-bold mb-8">Device Permissions</h1>

      <div className="space-y-6 w-full max-w-md">
        <PermissionStatus
          icon={<Mic className="w-6 h-6" />}
          name="Microphone"
          status={micPermission}
        />
        <PermissionStatus
          icon={<Camera className="w-6 h-6" />}
          name="Camera"
          status={cameraPermission}
        />
      </div>

      {(micPermission === false || cameraPermission === false) && (
        <div className="mt-8">
          <Button
            onClick={requestPermissions}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Allow Microphone and Camera
          </Button>
        </div>
      )}

      {micPermission === false && cameraPermission === false && (
        <p className="mt-4 text-red-400">
          Permission request failed. Please check your browser settings and try
          again.
        </p>
      )}

      {/* Permission */}

      <div>
        <button
          onClick={startRecording}
          disabled={isRecording || !micPermission || !cameraPermission}
          className=" px-5 bg-gray-800 py-3 disabled:opacity-0"
        >
          Start Recording
        </button>
        <button
          style={styles.button}
          onClick={stopRecording}
          disabled={!isRecording}
          className=" px-5 bg-gray-800 py-3 disabled:opacity-0"
        >
          Stop Recording
        </button>
      </div>

      {is_shown && (
        <div className=" flex justify-center items-center absolute top-0 left-0 w-full h-full backdrop-blur-xl">
          <div className="px-4 py-3 w-[12cm] h-[8cm] bg-gray-400/20 rounded-2xl flex flex-col gap-2">
            <p className=" text-center">
              Do you want to upload the saved video right now?
            </p>
            <Button
              className=" bg-red-400 text-red-700 hover:bg-red-400/40 rounded-[0.5rem]"
              onClick={() => {
                router.push(`/instructor/dashboard`);
              }}
            >
              Upload Later
            </Button>
            <Button
              onClick={() => {
                let session = new Date().toISOString();
                router.push(
                  `/instructor/upload/submit?session=${session}&id=${id}`
                );
              }}
              className=" bg-emerald-400 text-emerald-700 hover:bg-emerald-400/70 rounded-[0.5rem]"
            >
              Upload Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#282c34",
    color: "white",
    fontFamily: "Arial, sans-serif",
    textAlign: "center" as const,
  },
  button: {
    margin: "10px",
    padding: "15px 25px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    transition: "background 0.3s ease",
  },
  videoContainer: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },
  video: {
    width: "40%",
    borderRadius: "10px",
    border: "2px solid white",
  },
};

export default ScreenCameraRecorder;
