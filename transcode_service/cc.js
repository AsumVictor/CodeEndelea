import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";

// Set the path for ffmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

// Resolutions for transcoding
const resolutions = [
  {
    resolution: "320x180",
    videoBitrate: "500k",
    audioBitrate: "64k",
  },
  {
    resolution: "854x480",
    videoBitrate: "1000k",
    audioBitrate: "128k",
  },
  {
    resolution: "1280x720",
    videoBitrate: "2500k",
    audioBitrate: "192k",
  },
];

// Input and output paths
// const inputFile = "./local.mp4"; // Replace with your input video file path
const outputDir = "./hls_output"; // Directory to store output files


export async function transcodeVideo(inputFile, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    const variantPlaylists = [];

    // Process each resolution
    for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
      console.log(`Starting transcoding for resolution ${resolution}...`);

      const outputFileName = `${path.basename(inputFile, path.extname(inputFile))}_${resolution}.m3u8`;
      const segmentFileName = `${path.basename(inputFile, path.extname(inputFile))}_${resolution}_%03d.ts`;
      const outputPath = path.join(outputDir, outputFileName);

      await new Promise((resolve, reject) => {
        ffmpeg(inputFile)
          .outputOptions([
            `-c:v h264`,
            `-b:v ${videoBitrate}`,
            `-c:a aac`,
            `-b:a ${audioBitrate}`,
            `-vf scale=${resolution}`,
            `-f hls`,
            `-hls_time 10`,
            `-hls_list_size 0`,
            `-hls_segment_filename ${path.join(outputDir, segmentFileName)}`,
          ])
          .output(outputPath)
          .on("end", () => {
            console.log(`Completed transcoding for resolution ${resolution}`);
            variantPlaylists.push({ resolution, outputFileName });
            resolve();
          })
          .on("error", (err) => reject(err))
          .run();
      });
    }

    // Generate master playlist
    console.log("Generating master playlist...");
    let masterPlaylist = `#EXTM3U\n`;
    variantPlaylists.forEach(({ resolution, outputFileName }, index) => {
      const bandwidth =
        index === 0
          ? 676800
          : index === 1
          ? 1353600
          : 3230400; // Adjust bandwidth for each resolution
      masterPlaylist += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFileName}\n`;
    });

    const masterPlaylistPath = path.join(outputDir, "master.m3u8");
    fs.writeFileSync(masterPlaylistPath, masterPlaylist);
    console.log(`Master playlist generated: ${masterPlaylistPath}`);



  } catch (error) {
    console.error("Error during transcoding:", error);
  }
}

// transcodeVideo();
