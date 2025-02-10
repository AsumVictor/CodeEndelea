import express from "express";
import multer from "multer";

const router = express.Router();

import { get_video_data, get_all_videos } from "../controller/auth.controller.js";

router.get("/:id", get_video_data);


router.get("/", get_all_videos);

export default router;
