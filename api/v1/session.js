const express = require("express");
const router = express.Router();
const libCommon = require("../../lib/common");
const SessionService = require("../../service/session.service");

router.post(
  "/",
  libCommon.validateRequiredParams(["applicationId", "uiProfileId", "secret"]),
  createSession
);

function createSession(req, res) {
  SessionService.createSession(req).then((result) => {
    res.status(result.status).json(result);
  });
}

router.get("/:id", getSession);
function getSession(req, res) {
  SessionService.getSession(req).then((result) => {
    res.status(result.status).json(result);
  });
}

router.put("/:id/connect", connect);
function connect(req, res) {
  SessionService.connectSession(req).then((result) => {
    res.status(result.status).json(result);
  });
}
router.put("/:id/disconnect", disconnect);
function disconnect(req, res) {
  SessionService.disconnectSession(req).then((result) => {
    res.status(result.status).json(result);
  });
}

module.exports = router;
