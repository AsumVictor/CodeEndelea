const express = require("express");
const api_endpoint = express();
const upload_route = require("./upload.route")


api_endpoint.use("/upload", upload_route);

module.exports = api_endpoint;
