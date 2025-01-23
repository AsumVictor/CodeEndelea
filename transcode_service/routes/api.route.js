import express from "express";
import { produceMessage } from "../kafka/produce.job.js";
const api_endpoint = express();

api_endpoint.use("/", async (req, res) => {
     produceMessage("update_url", req.body);
     res.json("Sent")
});

export default api_endpoint;
