import catchAsyncError from "../middleware/catchAsyncError.js";
import ResponseError from "../utilities/ErrorHandler.js";
import VideoModel from "../model/video.model.js";

// Just initialing the chunking here
export const get_video_data = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;

    const video = await VideoModel.findById(id);

    res.status(200).json(video);
  } catch (error) {
    console.error("Error initializing upload:", error);
    return next(new ResponseError(error.message, 400));
  }
});

export const get_all_videos = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;

    const video = await VideoModel.find();

    res.status(200).json(video);
  } catch (error) {
    console.error("Error initializing upload:", err);
    return next(new ResponseError(error.message, 400));
  }
});
