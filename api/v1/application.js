const express = require("express");
const createApplication = require("express/lib/express");
const router = express.Router();
const libCommon = require("../../lib/common");
const ApplicationService = require("../../service/application.service");

router.post(
  "/",
  libCommon.validateRequiredParams(["secret", "name"]),
  libCommon.verifyToken,
  createNewApplication
);

router.get("/:id", libCommon.verifyToken, getApplication);

function createNewApplication(req, res) {
  ApplicationService.createApplication(req).then((result) => {
    res.status(result.status).json(result);
  });
}

function getApplication(req, res) {
  ApplicationService.getApplication(req).then((result) => {
    res.status(result.status).json(result);
  });
}
module.exports = router;
