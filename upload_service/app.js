const express = require("express");
const app = express();
const cors = require("cors");
const ErrorHandler = require("./middleware/error.js");
const api_endpoint = require("./routes/index.js")
const express_upload = require("express-fileupload")

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
// app.use(express_upload())


app.use("/", express.static("uploads"));
app.use(express.json({ limit: "50mb" }));

// handling api routues

// temporary middleware
app.use((req, res, next) => {
  console.log(req.origin);
  console.log(`incoming request: ${req.path}`);
  next();
});

// Setting up API endpoint 

app.use("/api/v1", api_endpoint)

// Routes for all request not API end-point
app.all("*", (req, res, next) => {
  if (req.path == "/") {
    res.json("Home");
  } else {
    res.json("Invalid");
  }
  next();
});

app.use(ErrorHandler);
module.exports = app;
