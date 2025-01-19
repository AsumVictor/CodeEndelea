import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required to filled"],
    },
    description: {
      type: String,
      required: [true, "description is required to filled"],
    },
    length: {
      type: Number,
      required: [true, "Video length is needed"],
    },
    exercise_timestamps: {
      type: [Number],
      required: false,
      default: [],
    },
    screen_url: {
      type: String,
      required: [true, "Screen Video url is required to create a video"],
    },
    camera_url: {
      type: String,
      required: [true, "Camera video url is required to create a video"],
    },
    screen_hsl_url: {
      type: String,
      required: false,
    },
    camera_hsl_url: {
      type: String,
      required: false,
    },
    reactions: {
      type: [Number],
      required: false,
      default: [0, 0, 0, 0],
      // not understand,kind of, moderate, understand, filled
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

/*

- A video have title, description, length, exercise timestamps -> [],
- screen hls url, screen url, camera hls url, camera url
- reactions of students
- 



*/

export default mongoose.model("video-metadata-v1", videoSchema);
