import mongoose from "mongoose";

const VideoCodeModel = new mongoose.Schema(
  {
    vid_id: {
      required: [true, "Video id must always be defined"],
      type: String,
    },
    time_stamp: {
      type: Number,
      required: [true, "Timestammps is required"],
    },
    editor_state: {
      type: {},
      required: [true, "editor_state is required"],
    },
    canvas_state: {
      type: {},
      required: [true, "canvas_state is required"],
    },
    screen_state: {
      type: {},
      required: [true, "screen_state is required"],
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

/*

@param 
- video id
- time: number
- code editor state: string
- canvas state: string
- screen state: string







*/

export default mongoose.model("video-code-v1", VideoCodeModel);
