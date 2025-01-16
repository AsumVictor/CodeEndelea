const catchAsyncError = require("../middleware/catchAsyncError");
const aws = require("aws-sdk");
const ResponseError = require("../utilities/ErrorHandler");

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

    const result = await s3_upload.uploadPart(params).promise();
    console.log("data------- ", result);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error uploading chunk:", err);
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

    // await addVideoDetailsToDB(title, description , author, uploadResult.Location);
    // pushVideoForEncodingToKafka(title, uploadResult.Location);
    return res
      .status(201)
      .json({ uploadResult, message: "Uploaded successfully!!!" });

  } catch (error) {
    console.log("Error handling complete", error);
    return next(new ResponseError(error.message, 400));
  }
});

module.exports = {
  initialized_upload,
  upload_chunk,
  complete_upload,
};
