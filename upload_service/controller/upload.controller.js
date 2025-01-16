const catchAsyncError = require("../middleware/catchAsyncError")


const initialized_upload = catchAsyncError(async (req, res)=>{
  res.json("Work")
})


const upload_chunk = catchAsyncError(async (req, res)=>{
    res.json("Work")
})


const complete_upload = catchAsyncError(async (req, res)=>{
    res.json("Work")
})

module.exports = {
    initialized_upload, upload_chunk, complete_upload
}
