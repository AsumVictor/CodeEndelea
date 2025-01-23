import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { transcodeVideo } from "../cc.js";
import { kafka_update_url } from "../controller/kafka.controller.js";
import { produceMessage } from "../kafka/produce.job.js";

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

export const Transcode = async (title, url, field, _id) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECURITY_ACCESS_KEY,
  });

  const bucketName = process.env.AWS_BUCKET_NAME;
  const hlsFolder = `hsl/${_id}`;

  console.log("Starting script");
  console.time("req_time");

  try {
    // Download the file from S3
    console.log("Downloading S3 mp4 file locally...");
    const mp4FilePath = `${url}`;
    const localFilePath = `./${url.replace(".", "")}.mp4`;

    const writeStream = fs.createWriteStream(localFilePath);

    const readStream = s3
      .getObject({
        Bucket: bucketName,
        Key: mp4FilePath,
      })
      .createReadStream();

    readStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log("Downloaded S3 mp4 file locally.");

    await transcodeVideo(localFilePath, hlsFolder, url);

    // Delete local MP4 file
    console.log("Deleting local MP4 file...");
    fs.unlinkSync(localFilePath);
    console.log("Local MP4 file deleted.");

    // Upload generated HLS files to S3
    console.log("Uploading HLS files to S3...");
    const files = fs.readdirSync(hlsFolder);

    let new_url = null;
    for (const file of files) {
      const filePath = path.join(hlsFolder, file);
      const fileStream = fs.createReadStream(filePath);

      const uploadParams = {
        Bucket: bucketName,
        Key: `${hlsFolder}/${file}`,
        Body: fileStream,
        ContentType: file.endsWith(".ts")
          ? "video/mp2t"
          : file.endsWith(".m3u8")
          ? "application/x-mpegURL"
          : null,
      };

      let res = await s3.upload(uploadParams).promise();
      if (file.endsWith("master.m3u8")) {
        new_url = res.Location;
      }

      try {
        fs.unlinkSync(filePath); // Clean up local files
      } catch (error) {
        continue;
      }
    }

    console.log("URL AFTER UPLOAD TO S3: ==>", new_url);
    produceMessage("update_url", {
      title,
      url: new_url,
      field,
      _id,
    });

    console.log(
      `HLS files uploaded to S3 and local files cleaned up. ==> for ${url}`
    );
    console.timeEnd("req_time");
  } catch (error) {
    console.error("Error during transcoding process:", error);
  }
};

export default Transcode;
