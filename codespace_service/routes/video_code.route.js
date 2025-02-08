import express from "express";
import multer from "multer";
import { get_code_at, upload_code } from "../controller/videoCode.controller.js";

const router = express.Router()



const upload = multer();

router.post("/upload", upload_code);

router.get("/", get_code_at);

// router.post("/complete", );

// router.post("/db", );

// router.post("/metadata", )

// router.post("/update", dd)

export default router;
 