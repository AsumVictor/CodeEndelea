import express from "express";
import multer from "multer";

const router = express.Router();

import { get_video_data } from "../controller/upload.controller.js";

const upload = multer();

router.get("/:id", get_video_data);

// router.post("/update", dd)

export default router;
