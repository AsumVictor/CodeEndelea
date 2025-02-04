import express from "express";
const api_endpoint = express();
import upload_route from "./watch.route.js";

api_endpoint.use("/watch", upload_route);


export default api_endpoint;
