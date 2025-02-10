import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    user_name: {
      required: [true, "Username is required!"],
      type: String,
      unique: [true, "Username is already taken"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: [true, "Email is already unique"],
      validate: () => {
        return true;
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      
    }
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
