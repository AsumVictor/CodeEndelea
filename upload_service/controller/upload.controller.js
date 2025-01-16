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
    console.log("multipartparams---- ");
    const multipart = await s3_upload.createMultipartUpload(params).promise();
    console.log("multipartparams---- ", multipart);
    const upload_id = multipart.UploadId;

    res.status(200).json({ upload_id });
  } catch (error) {
    return next(new ResponseError(error.message, 400));
  }
});

const upload_chunk = catchAsyncError(async (req, res) => {
  res.json("Work");
});

const complete_upload = catchAsyncError(async (req, res) => {
  res.json("Work");
});

module.exports = {
  initialized_upload,
  upload_chunk,
  complete_upload,
};
