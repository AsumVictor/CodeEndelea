import express from "express";
const api_endpoint = express();
import auth_route from "./auth.route.js";

api_endpoint.use("/watch", auth_route);


export default api_endpoint;
