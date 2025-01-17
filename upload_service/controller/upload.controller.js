const catchAsyncError = require("../middleware/catchAsyncError");
const aws = require("aws-sdk");
const ResponseError = require("../utilities/ErrorHandler");
const videoModel = require("../model/video.model");

// Just initialing the chunking here
const initialized_upload = catchAsyncError(async (req, res, next) => {
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
const upload_chunk = catchAsyncError(async (req, res, next) => {
  console.log("Work");
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

const complete_upload = catchAsyncError(async (req, res, next) => {
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

const save_to_db = catchAsyncError(async (req, res, next) => {
  try {
    console.log("Save video metada");
    const { title, description, length, screen_url, camera_url } = req.body;

    if (!title || !description || !length || !screen_url || !camera_url) {
      return next(new ResponseError("Some filds are not completed", 400));
    }

    // creating data in database
    const video = await videoModel.create(req.body);

    // pushVideoForEncodingToKafka(title, uploadResult.Location);
    return res.status(201).json({ data: video });
  } catch (error) {
    console.log("Error handling complete", error);
    return next(new ResponseError(error.message, 400));
  }
});

module.exports = {
  initialized_upload,
  upload_chunk,
  complete_upload,
  save_to_db
};
