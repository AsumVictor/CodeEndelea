import express from "express";
const api_endpoint = express();
import upload_route from "./video_code.route.js";

api_endpoint.use("/code", upload_route);


export default api_endpoint;
