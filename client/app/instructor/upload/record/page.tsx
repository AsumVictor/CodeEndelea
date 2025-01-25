"use client"

import React, { useRef, useState } from "react";

const ScreenCameraRecorder: React.FC = () => {
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
      if (screenVideoRef.current) screenVideoRef.current.srcObject = screenStream;
      if (cameraVideoRef.current) cameraVideoRef.current.srcObject = cameraStream;

      // Initialize MediaRecorders
      const screenRecorder = new MediaRecorder(screenStream);
      const cameraRecorder = new MediaRecorder(cameraStream);

      screenRecorderRef.current = screenRecorder;
      cameraRecorderRef.current = cameraRecorder;

      // Store recorded chunks
      screenRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) setScreenChunks((prev) => [...prev, event.data]);
      };

      cameraRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) setCameraChunks((prev) => [...prev, event.data]);
      };

      // Start recording
      screenRecorder.start();
      cameraRecorder.start();
      setIsRecording(true);

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

  return (
    <div style={styles.container}>
      <h1>Screen & Camera Recorder</h1>
      <p>Record your screen and webcam separately and save both videos!</p>
      <div>
        <button
          style={styles.button}
          onClick={startRecording}
          disabled={isRecording}
        >
          Start Recording
        </button>
        <button
          style={styles.button}
          onClick={stopRecording}
          disabled={!isRecording}
        >
          Stop Recording
        </button>
        <button
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
        </button>
      </div>
      <div style={styles.videoContainer}>
        <video
          ref={screenVideoRef}
          autoPlay
          muted
          style={styles.video}
        ></video>
        <video
          ref={cameraVideoRef}
          autoPlay
          muted
          style={styles.video}
        ></video>
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
