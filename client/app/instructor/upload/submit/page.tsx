"use client";

import { useState } from "react";
import axios from "axios";
import { Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function UploadPage({
  searchParams,
}: {
  searchParams: { id?: string; session?: string };
}) {
  const { session, id } = searchParams;
  console.log(id);
  const [screenVideo, setScreenVideo] = useState<File | null>(null);
  const [cameraVideo, setCameraVideo] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [is_shown, setIsShown] = useState(true);

  async function uploadFile(file: File, fileType: string) {
    // Step 1: Initialize Upload
    const initializeFormData = new FormData();
    initializeFormData.append("filename", file.name);
    initializeFormData.append("fileType", fileType);

    const initializeRes = await axios.post(
      "http://localhost:8080/api/v1/upload/initialize",
      initializeFormData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const { upload_id: uploadId } = initializeRes.data;
    console.log(`Initialized ${fileType}:`, uploadId);

    // Step 2: Upload Chunks
    const chunkSize = 5 * 1024 * 1024; // 5 MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    let start = 0;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const chunk = file.slice(start, start + chunkSize);
      start += chunkSize;

      const chunkFormData = new FormData();
      chunkFormData.append("filename", file.name);
      chunkFormData.append("chunk", chunk);
      chunkFormData.append("totalChunks", totalChunks.toString());
      chunkFormData.append("chunkIndex", chunkIndex.toString());
      chunkFormData.append("uploadId", uploadId);

      await axios.post("http://localhost:8080/api/v1/upload", chunkFormData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentage =
            ((chunkIndex + (progressEvent.loaded || 0) / chunk.size) /
              totalChunks) *
            100;
          setProgress((prevProgress) => Math.max(prevProgress, percentage));
        },
      });
    }

    // Step 3: Complete Upload
    const response = await axios.post(
      "http://localhost:8080/api/v1/upload/complete",
      {
        filename: file.name,
        totalChunks,
        uploadId,
        fileType,
      }
    );
    const { url } = response.data;
    return url;
  }

  async function handleUpload() {
    if (!screenVideo || !cameraVideo) {
      alert("Both videos must be selected.");
      return;
    }

    setProgress(0);
    setUploading(true);

    try {
      // Upload Screen Video First
      const screen = await uploadFile(screenVideo, "Screen Record");

      // Upload Camera Video Second
      const camera = await uploadFile(cameraVideo, "Camera");

      console.log("Screen", screen);
      console.log("Camera", camera);

      // Final Step: Notify the Server (Database Request)
      await axios.post("http://localhost:8080/api/v1/upload/db", {
        length: 388,
        _id: id,
        screen_url: screen,
        camera_url: camera,
        screen_key: screenVideo.name,
        camera_key: cameraVideo.name,
      });

      setUploadComplete(true);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("File upload failed!");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Sequential File Upload
        </h1>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="screenVideo"
              className="block text-sm font-medium mb-1"
            >
              Screen Record Video:
            </label>
            <Input
              type="file"
              id="screenVideo"
              accept="video/*"
              onChange={(e) => setScreenVideo(e.target.files?.[0] || null)}
              required
              className="text-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="cameraVideo"
              className="block text-sm font-medium mb-1"
            >
              Camera Video:
            </label>
            <Input
              type="file"
              id="cameraVideo"
              accept="video/*"
              onChange={(e) => setCameraVideo(e.target.files?.[0] || null)}
              required
              className="text-gray-900"
            />
          </div>
          <Progress value={progress} className="w-full" />
          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploading || !screenVideo || !cameraVideo}
            className="w-full"
          >
            {uploading ? (
              <Upload className="mr-2 h-4 w-4 animate-spin" />
            ) : uploadComplete ? (
              <CheckCircle className="mr-2 h-4 w-4" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {uploading
              ? "Uploading..."
              : uploadComplete
              ? "Upload Complete"
              : "Upload"}
          </Button>
        </form>
      </div>

      {uploadComplete && (
        <div className=" flex justify-center items-center absolute top-0 left-0 w-full h-full backdrop-blur-xl">
          <div className="px-4 py-3 w-[12cm] h-[8cm] bg-gray-400/20 rounded-2xl flex flex-col gap-2">
            <p className=" text-center">Video finish. Now uploading codebase</p>
          </div>
        </div>
      )}
    </div>
  );
}
