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

router.get("/:id", libCommon.verifyToken, getUiProfile);
router.put("/:id", libCommon.verifyToken, updateUiProfile);

function createNewUiProfile(req, res) {
  UiProfileService.createUiProfile(req).then((result) => {
    res.status(result.status).json(result);
  });
}

function getUiProfile(req, res) {
  UiProfileService.getUiProfile(req).then((result) => {
    res.status(result.status).json(result);
  });
}
function updateUiProfile(req, res) {
  UiProfileService.updateUiProfile(req).then((result) => {
    res.status(result.status).json(result);
  });
}
module.exports = router;
