const router = require("express").Router();
const multer = require("multer");

const {
  initialized_upload,
  upload_chunk,
  complete_upload,
  save_to_db,
} = require("../controller/upload.controller");
const upload = multer();

router.post("/", upload.single("chunk"), upload_chunk);

router.post("/initialize", upload.none(), initialized_upload);

router.post("/complete", complete_upload);

router.post("/db", save_to_db);

module.exports = router;
