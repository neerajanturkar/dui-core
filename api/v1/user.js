const express = require("express");
const router = express.Router();
const libCommon = require("../../lib/common");
const UserService = require("../../service/user.service");

router.post(
  "/signup",
  libCommon.validateRequiredParams(["email", "type", "name", "password"]),
  signup
);

function signup(req, res) {
  UserService.createUser(req).then((result) => {
    res.status(result.status).json(result);
  });
}

/**
 * @swagger
 * /api/v1/user/login:
 *  post:
 *    description: Create a user
 *    responses:
 *      '200':
 *        description: User created successfully
 *      '500':
 *        description: Internal Server Error
 */
router.post(
  "/login",
  libCommon.validateRequiredParams(["email", "password"]),
  login
);

function login(req, res) {
  UserService.login(req).then((result) => {
    res.status(result.status).json(result);
  });
}

/**
 * @swagger
 * /api/v1/user/:id:
 *  put:
 *    description: Updates a user
 *    responses:
 *      '200':
 *        description: User created successfully
 *      '403':
 *        description: Unaouthorized access
 *      '500':
 *        description: Internal Server Error
 */
router.put("/:id", libCommon.verifyToken, updateUser);

function updateUser(req, res) {
  UserService.updateUser(req).then((result) => {
    res.status(result.status).json(result);
  });
}

router.get("/:id", libCommon.verifyToken, getUser);
function getUser(req, res) {
  UserService.getUser(req).then((result) => {
    res.status(result.status).json(result);
  });
}

router.get("/", libCommon.verifyToken, getAllUsers);
function getAllUsers(req, res) {
  UserService.getAllUsers(req).then((result) => {
    res.status(result.status).json(result);
  });
}

router.get("/:id/requests", libCommon.verifyToken, getRequestsByUserId);
function getRequestsByUserId(req, res) {
  RequestService.getRequestsByUser(req).then((result) => {
    res.status(result.status).json(result);
  });
}

module.exports = router;
