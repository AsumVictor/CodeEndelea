const express = require("express");

const api_endpoint = express.Router();

// Define the /transcode route
api_endpoint.post("/transcode", (req, res) => {
  res.json({ message: "Transcoding started!", data: req.body });
});

// Define the /upload route
api_endpoint.post("/upload", (req, res) => {
  res.json({ message: "File uploaded successfully!", data: req.body });
});

// Handle invalid paths within /api/v1
api_endpoint.all("*", (req, res) => {
  res.status(404).json({ error: "Invalid path" });
});

module.exports = api_endpoint;
