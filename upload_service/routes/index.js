import express from "express";
const api_endpoint = express();
import upload_route from "./upload.route.js"
import { kafka_transcode } from "../controller/kafka.controller.js";


api_endpoint.use("/upload", upload_route);
api_endpoint.use("/dd", (req, res)=>{
    const {title, url} = req.body
    try {
        kafka_transcode(title, url)
        res.status(200).json("Yes it works")
    } catch (error) {
        console.log(error)
    }
})

export default api_endpoint;
