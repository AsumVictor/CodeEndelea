"use client";
import { VideoMetaData } from "@/components/types/editor";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function page() {
  const [allVideos, setVideos] = useState<VideoMetaData[]>([]);

  useEffect(() => {
    const getVideoData = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/v1/watch`);
        const videos: VideoMetaData[] = response.data;
        if (!videos) {
          throw new Error("Failed to fetch");
        }

        setVideos(videos);
      } catch (error) {
        console.error(error);
      }
    };
    getVideoData();
  }, []);

  return (
    <div className=" w-full my-10 gap-3 px-10 grid grid-cols-3 ">
      {allVideos.map((i) => (
        <Link
          href={`watch/${i._id}`}
          className="
bg-gray-600/20 px-3 py-3 rounded-2xl
"
        >
          <p className=" text-center font-semibold text-xl py-2">{i.title}</p>
          <p>{i.description}</p>
        </Link>
      ))}
    </div>
  );
}

export default page;
