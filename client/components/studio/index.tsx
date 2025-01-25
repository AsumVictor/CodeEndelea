"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { SplitPane } from "./SplitPane"

export function Studio() {
  const [isRecording, setIsRecording] = useState(false)
  const [showLeft, setShowLeft] = useState(true)
  const [showRight, setShowRight] = useState(true)
  const [controlPosition, setControlPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const screenRecorderRef = useRef<MediaRecorder | null>(null)
  const cameraRecorderRef = useRef<MediaRecorder | null>(null)
  const screenChunksRef = useRef<Blob[]>([])
  const cameraChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })

      screenRecorderRef.current = new MediaRecorder(screenStream)
      cameraRecorderRef.current = new MediaRecorder(cameraStream)

      screenRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          screenChunksRef.current.push(event.data)
        }
      }

      cameraRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          cameraChunksRef.current.push(event.data)
        }
      }

      screenRecorderRef.current.start()
      cameraRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = async () => {
    if (screenRecorderRef.current && cameraRecorderRef.current) {
      screenRecorderRef.current.stop()
      cameraRecorderRef.current.stop()
      setIsRecording(false)

      const screenBlob = new Blob(screenChunksRef.current, { type: "video/webm" })
      const cameraBlob = new Blob(cameraChunksRef.current, { type: "video/webm" })

      try {
        const screenHandle = await window.showSaveFilePicker({
          suggestedName: "screen-recording.webm",
          types: [{ description: "Video File", accept: { "video/webm": [".webm"] } }],
        })
        const screenWritable = await screenHandle.createWritable()
        await screenWritable.write(screenBlob)
        await screenWritable.close()

        const cameraHandle = await window.showSaveFilePicker({
          suggestedName: "camera-recording.webm",
          types: [{ description: "Video File", accept: { "video/webm": [".webm"] } }],
        })
        const cameraWritable = await cameraHandle.createWritable()
        await cameraWritable.write(cameraBlob)
        await cameraWritable.close()

        screenChunksRef.current = []
        cameraChunksRef.current = []
      } catch (error) {
        console.error("Error saving recordings:", error)
      }
    }
  }

  const toggleLeft = () => {
    if (showLeft || showRight) {
      setShowLeft(!showLeft)
    }
  }

  const toggleRight = () => {
    if (showLeft || showRight) {
      setShowRight(!showRight)
    }
  }

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
  }, [])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window
        const controlWidth = 300 // Approximate width of the control bar
        const controlHeight = 50 // Approximate height of the control bar

        let newX = clientX
        let newY = clientY

        if (clientX < innerWidth / 2) {
          newX = 0 // Stick to left
        } else {
          newX = innerWidth - controlWidth // Stick to right
        }

        if (clientY < innerHeight / 2) {
          newY = 0 // Stick to top
        } else {
          newY = innerHeight - controlHeight // Stick to bottom
        }

        setControlPosition({ x: newX, y: newY })
      }
    },
    [isDragging],
  )

  useEffect(() => {
    document.addEventListener("mousemove", handleDrag)
    document.addEventListener("mouseup", handleDragEnd)

    return () => {
      document.removeEventListener("mousemove", handleDrag)
      document.removeEventListener("mouseup", handleDragEnd)
    }
  }, [handleDrag, handleDragEnd])

  const LeftPane = () => (
    <div className="h-full bg-blue-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Left Pane</h2>
      <p>This is the content of the left pane.</p>
    </div>
  )

  const RightPane = () => (
    <div className="h-full bg-green-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Right Pane</h2>
      <p>This is the content of the right pane.</p>
    </div>
  )

  return (
    <div className="relative h-screen">
      <SplitPane left={showLeft ? <LeftPane /> : null} right={showRight ? <RightPane /> : null} />
      <div
        className="absolute bg-white p-4 rounded-lg shadow-lg cursor-move"
        style={{
          left: `${controlPosition.x}px`,
          top: `${controlPosition.y}px`,
        }}
        onMouseDown={handleDragStart}
      >
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-md ${
            isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          } text-white font-semibold mr-2`}
        >
          {isRecording ? "Stop" : "Start"}
        </button>
        <button
          onClick={toggleLeft}
          className={`px-4 py-2 rounded-md ${
            showLeft ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
          } text-white font-semibold mr-2`}
          disabled={!showLeft && !showRight}
        >
          {showLeft ? "Hide Left" : "Show Left"}
        </button>
        <button
          onClick={toggleRight}
          className={`px-4 py-2 rounded-md ${
            showRight ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 hover:bg-gray-400"
          } text-white font-semibold`}
          disabled={!showLeft && !showRight}
        >
          {showRight ? "Hide Right" : "Show Right"}
        </button>
      </div>
    </div>
  )
}

