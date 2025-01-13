const app = require("./app");

// connect to environment variables
if(process.env.NODE_ENV !=="PRODUCTION" || process.env.NODE_ENV != "production"){
   require("dotenv").config({
    path: "./.env"
   })
}

// Hangling uncatch execptions
process.on("unCaughtException", (err) => {
  console.log(`Error: => ${err.message}`);
  console.log("Server shutting down");
});

const server = app.listen(process.env.PORT, (err) => {
  // connect to database
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
// handle promises failure
process.on("onhandleRejection", (err) => {
  console.log(`Shutting down server --> ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
