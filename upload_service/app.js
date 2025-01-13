const express = require("express");
const app = express();
const cors = require("cors");
const ErrorHandler = require('./middleware/error.js')

// setup cross orgin resoures sharing
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
   methods: ["POST"]
};

app.use(cors(corsOptions));

// temporary middleware
app.use((req, res, next) => {
  console.log(req.origin);
  console.log(`incoming request: ${req.path}-${req.url}`);
  next();
});

app.use(ErrorHandler)
module.exports = app;
