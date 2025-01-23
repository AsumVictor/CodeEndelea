import express from "express";
import Transcode from "../utilities/transcode.utility.js";
const api_endpoint = express();

// api_endpoint.use("/", async (req, res) => {
//     await Transcode("Recording 2024-02-22 104849.mp4")
//   res.status(200).json("Work"); 
// });

export default api_endpoint;
