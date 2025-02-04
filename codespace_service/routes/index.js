import express from "express";
const api_endpoint = express();
import upload_route from "./upload.route.js";
import { kafka_transcode } from "../controller/kafka.controller.js";

api_endpoint.use("/upload", upload_route);


export default api_endpoint;
