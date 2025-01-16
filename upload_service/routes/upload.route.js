const router = require("express").Router();
const multer = require("multer");

const {
  initialized_upload,
  upload_chunk,
  complete_upload,
} = require("../controller/upload.controller");
const upload = multer();

router.post("/initialize", upload.none(), initialized_upload);

router.post("/", upload.single("chunk"), upload_chunk);

router.post("/complete", complete_upload);

module.exports = router;
