import express from "express";
const app = express();
import cors from "cors";
import ErrorHandler from "./middleware/error.js";
import api_endpoint from "./routes/index.js";


// setting up cross orgin resoures sharing
const corsOptions = {
  origin:
    process.env.NODE_ENV == "PRODUCTION"
      ? (origin, callback) => {
          // rejecting no origin in production

          if (!origin || !allowedOrigins.has(origin))
            return callback(new Error("Internal Server Error"));

          return callback(null, true);
        }
      : "*",
  credentials: true,
  methods: ["POST"],
};

app.use(cors(corsOptions));
app.use("/", express.static("uploads"));
// app.use(express_upload())
app.use(express.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// handling api routues

// temporary middleware
app.use((req, res, next) => {
  console.log(`incoming request: ${req.path}`);
  next();
});

// Setting up API endpoint

app.use("/api/v1", api_endpoint);


// Routes for all request not API end-point
app.all("*", (req, res, next) => {
  if (req.path == "/") {
    res.json("Home");
  } else {
    res.json("Invalid path home");
  }
  next();
});


app.use(ErrorHandler);
export default app;
