// Imports
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const router = express.Router();
const appConfig = require("./config/app.config");
const user = require("./api/v1/user");
const application = require("./api/v1/application");
const uiProfile = require("./api/v1/uiProfile");
const session = require("./api/v1/session");

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

app.use("/api/v1/user", user);
app.use("/api/v1/application", application);
app.use("/api/v1/uiProfile", uiProfile);
app.use("/api/v1/session", session);
// mongoose.connect(appConfig.db.mongodb.CONNECTION_URL);
mongoose.connect("mongodb://localhost:27017/dui-core");

mongoose.connection.on("connected", () => {
  // eslint-disable-next-line no-console
  console.log("Mongodb connected");
});

app.listen(appConfig.PORT, () =>
  console.log(`Server started on ${appConfig.PORT}`)
);
module.exports = app;
