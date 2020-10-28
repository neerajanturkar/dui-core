// Imports
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const appConfig = require("./config/app.config");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// mongoose.connect(appConfig.db.mongodb.CONNECTION_URL);
// mongoose.connection.on("connected", () => {
//   // eslint-disable-next-line no-console
//   console.log("Mongodb connected");
// });

app.listen(appConfig.PORT, () =>
  console.log(`Server started on ${appConfig.PORT}`)
);
module.exports = app;
