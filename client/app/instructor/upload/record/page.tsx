"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Camera, XCircle, CheckCircle } from "lucide-react";
import { PermissionStatus } from "@/components/record/PermissionStatus";

const ScreenCameraRecorder: React.FC = () => {
  // Checking permission here
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );

  // getting all the state

 
  const [isRecording, setIsRecording] = useState(false);
  const [screenChunks, setScreenChunks] = useState<Blob[]>([]);
  const [cameraChunks, setCameraChunks] = useState<Blob[]>([]);

  const screenStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraRecorderRef = useRef<MediaRecorder | null>(null);

  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);

  const startRecording = async () => {
    try {
      // Get screen stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: false,
      });

      // Get camera stream
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Assign streams to refs
      screenStreamRef.current = screenStream;
      cameraStreamRef.current = cameraStream;

      // Attach streams to video elements for live preview
      if (screenVideoRef.current)
        screenVideoRef.current.srcObject = screenStream;
      if (cameraVideoRef.current)
        cameraVideoRef.current.srcObject = cameraStream;

      // Initialize MediaRecorders
      const screenRecorder = new MediaRecorder(screenStream);
      const cameraRecorder = new MediaRecorder(cameraStream);

      screenRecorderRef.current = screenRecorder;
      cameraRecorderRef.current = cameraRecorder;

      // Store recorded chunks
      screenRecorder.ondataavailable = (event) => {
        if (event.data.size > 0)
          setScreenChunks((prev) => [...prev, event.data]);
      };

      cameraRecorder.ondataavailable = (event) => {
        if (event.data.size > 0)
          setCameraChunks((prev) => [...prev, event.data]);
      };

      // Start recording
      screenRecorder.start();
      cameraRecorder.start();
      setIsRecording(true);
      sendMessage()

      console.log("Recording started...");
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    // Stop screen recording
    if (screenRecorderRef.current) {
      screenRecorderRef.current.stop();
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    }

    // Stop camera recording
    if (cameraRecorderRef.current) {
      cameraRecorderRef.current.stop();
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    }

    setIsRecording(false);
    console.log("Recording stopped.");
  };

  const saveRecording = (chunks: Blob[], fileName: string) => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    console.log(`${fileName} saved.`);
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

 

 

  // Local storage pulling
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    // Write to localStorage
    localStorage.setItem("sharedData", JSON.stringify({ message: "Hello from Tab Recording!" }));
  };

  useEffect(() => {
    // Listen for changes in localStorage
    window.addEventListener("storage", (event) => {
      if (event.key === "sharedData") {
        const newMessage = JSON.parse(event.newValue || "{}");
        setMessage(newMessage.message); // Update state with the new message
      }
    });

    return () => {
      window.removeEventListener("storage", () => {});
    };
  }, []);

  return (
    <div style={styles.container}>
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
        {/* <button
          style={styles.button}
          onClick={() => saveRecording(screenChunks, "screen-recording.webm")}
          disabled={isRecording || screenChunks.length === 0}
        >
          Save Screen Recording
        </button>
        <button
          style={styles.button}
          onClick={() => saveRecording(cameraChunks, "camera-recording.webm")}
          disabled={isRecording || cameraChunks.length === 0}
        >
          Save Camera Recording
        </button> */}
      </div>
      <div style={styles.videoContainer}>
        <video ref={screenVideoRef} autoPlay muted style={styles.video}></video>
        <video ref={cameraVideoRef} autoPlay muted style={styles.video}></video>
      </div>
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
