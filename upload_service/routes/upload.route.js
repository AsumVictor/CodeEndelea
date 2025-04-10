import express from "express";
import multer from "multer";

const router = express.Router()

import {
  initialized_upload,
  upload_chunk,
  complete_upload,
  save_to_db,
  save_metadata_to_db,
} from "../controller/upload.controller.js";
// import { produceMessage } from "../kafka/produce.job.js";

const upload = multer();

router.post("/", upload.single("chunk"), upload_chunk);

router.post("/initialize", upload.none(), initialized_upload);

router.post("/complete", complete_upload);

router.post("/db", save_to_db);

router.post("/metadata", save_metadata_to_db)

// router.post("/update", dd)

export default router;
 