import catchAsyncError from "../middleware/catchAsyncError.js";
import aws from "aws-sdk";
import ResponseError from "../utilities/ErrorHandler.js";
import VideoCodeModel from "../model/video_code.model.js";

// Just initialing the chunking here
export const upload_code = catchAsyncError(async (req, res, next) => {
  try {
    const { vid_id, time_stamp, editor_state, canvas_state, screen_state } =
      req.body;

    if ((!vid_id, !time_stamp, !editor_state, !canvas_state, !screen_state)) {
      return next(new ResponseError("All fields are required"));
    }

    await VideoCodeModel.create({
      vid_id,
      time_stamp,
      editor_state,
      canvas_state,
      screen_state,
    });

    res.status(200).json("Code uploaded successfully!");
  } catch (error) {
    console.error("Error initializing upload:", err);
    return next(new ResponseError(error.message, 400));
  }
});

export const get_code_at = catchAsyncError(async (req, res, next) => {
  try {
    const { vid_id, time_stamp } = req.body;

    if ((!vid_id, !time_stamp)) {
      return next(new ResponseError("All fields are required"));
    }

    const result = await VideoCodeModel.findOne({
      vid_id,
      time_stamp: Math.ceil(time_stamp / 3) * 3,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error initializing upload:", err);
    return next(new ResponseError(error.message, 400));
  }
});
