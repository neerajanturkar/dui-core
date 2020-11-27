const express = require("express");
const router = express.Router();
const libCommon = require("../../lib/common");
const UiProfileService = require("../../service/uiProfile.service");

router.post(
  "/",
  libCommon.validateRequiredParams(["name", "type"]),
  libCommon.verifyToken,
  createNewUiProfile
);

function createNewUiProfile(req, res) {
  UiProfileService.createUiProfile(req).then((result) => {
    res.status(result.status).json(result);
  });
}
module.exports = router;
