import catchAsyncError from "../middleware/catchAsyncError.js";
import aws from "aws-sdk";
import ResponseError from "../utilities/ErrorHandler.js";
import videoModel from "../model/video.model.js";
import { kafka_transcode } from "./kafka.controller.js";
import { produceMessage } from "../kafka/produce.job.js";

// Just initialing the chunking here
export const initialized_upload = catchAsyncError(async (req, res, next) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return next(new ResponseError("filename is required", 400));
    }

    const s3_upload = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECURITY_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const params = {
      Key: filename,
      Bucket: process.env.AWS_BUCKET_NAME,
      ContentType: "video/mp4",
    };
    const multipart = await s3_upload.createMultipartUpload(params).promise();
    // console.log("multipartparams---- ", multipart);
    const upload_id = multipart.UploadId;

    res.status(200).json({ upload_id });
  } catch (error) {
    console.error("Error initializing upload:", err);
    return next(new ResponseError(error.message, 400));
  }
});

// Here we upload the actual code chunks
export const upload_chunk = catchAsyncError(async (req, res, next) => {
  try {
    const { filename, chunkIndex, uploadId } = req.body;

    if (!filename || !chunkIndex || !uploadId) {
      return next(new ResponseError("importance fileds are required", 400));
    }

    const s3_upload = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECURITY_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      UploadId: uploadId,
      PartNumber: parseInt(chunkIndex) + 1,
      Body: req.file.buffer,
    };
    console.log("work before upload");
    const result = await s3_upload.uploadPart(params).promise();
    console.log("data------- ", result);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error uploading chunk:", error);
    return next(new ResponseError(error.message, 400));
  }
});

export const complete_upload = catchAsyncError(async (req, res, next) => {
  try {
    console.log("Completing Upload");
    const { filename, totalChunks, uploadId } = req.body;

    const uploadedParts = [];

    // Building all uploadedParts array from request body
    for (let i = 0; i < totalChunks; i++) {
      uploadedParts.push({ PartNumber: i + 1, ETag: req.body[`part${i + 1}`] });
    }

    const s3_upload = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECURITY_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      UploadId: uploadId,
    };

    // Listing all parts using promise
    const data = await s3_upload.listParts(params).promise();

    const parts = data.Parts.map((part) => ({
      ETag: part.ETag,
      PartNumber: part.PartNumber,
    }));

    params.MultipartUpload = {
      Parts: parts,
    };

    // Completing multipart upload using promise
    const uploadResult = await s3_upload
      .completeMultipartUpload(params)
      .promise();

    console.log("data----- ", uploadResult);

    // creating data in database
    // const video = await videoModel.create(video_meta_data)

    // await addVideoDetailsToDB(title, description , author, uploadResult.Location);
    // pushVideoForEncodingToKafka(title, uploadResult.Location);
    return res.status(201).json({ url: uploadResult.Location });
  } catch (error) {
    console.log("Error handling complete", error);
    return next(new ResponseError(error.message, 400));
  }
});

export const save_to_db = catchAsyncError(async (req, res, next) => {
  try {
    console.log("Save video metada");
    const { _id, camera_key, screen_key, camera_url, screen_url } = req.body;

    if (
      !_id ||
      !camera_key ||
      !screen_key ||
      !camera_url ||
      !screen_url ||
      !length
    ) {
      return next(new ResponseError("Some filds are not completed", 400));
    }

    // updating data in database
    const update = {};
    update["screen_url"] = screen_url;
    update["camera_url"] = camera_url;
    update["length"] = length;

    const result = await videoModel.updateOne({ _id: _id }, { $set: update });

    // update camera
    produceMessage("transcode", {
      url: camera_key,
      field: "camera_hsl_url",
      _id,
    });

    // update the screen
    produceMessage("transcode", {
      title: ttl,
      url: screen_key,
      field: "screen_hsl_url",
      _id,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.log("Error handling complete", error);
    return next(new ResponseError(error.message, 400));
  }
});

export const save_metadata_to_db = catchAsyncError(async (req, res, next) => {
  try {
    console.log("Save video metada");
    const { title, description } = req.body;

    if (!title || !description) {
      return next(new ResponseError("Some filds are not completed", 400));
    }

    // creating data in database
    const video = await videoModel.create(req.body);


    return res.status(201).json({ _id: video._id });
  } catch (error) {
    console.log("Error handling complete", error);
    return next(new ResponseError(error.message, 400));
  }
});

// export const dd = catchAsyncError(async (req, res, next) => {
//   const { field, url, _id } = req.body;
//   // console.log({ field, url, _id });
//   const result = update_video_url(field, url, _id);
//   res.json(result);
// });

export const update_video_url = catchAsyncError(async (field, url, _id) => {
  try {
    console.log("In process", field, url, _id);

    const update = {};
    update[field] = url;

    const result = await videoModel.updateOne({ _id: _id }, { $set: update });
    console.log(result);
  } catch (error) {
    // Send notification that it failed
    console.log("Error in updating", error);
  }
});
