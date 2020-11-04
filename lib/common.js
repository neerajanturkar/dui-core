const atob = require("atob");
const jwt = require("jsonwebtoken");
module.exports.verifyToken = function (req, res, next) {
  exports.extractToken(req).then((result) => {
    if (result.success) {
      req.token = result.token;
      next();
    } else {
      res.status(403).json(result);
    }
  });
};

module.exports.generateToken = async function (user) {
  return await jwt.sign(
    {
      id: user._id,
      email: user.email,
      type: user.type,
    },
    "secretKey",
    { expiresIn: "900s" }
  );
};
module.exports.validateRequiredParams = function (parameters) {
  return (req, res, next) => {
    let validationFailed = false;
    parameters.forEach((parameter) => {
      if (!req.body.hasOwnProperty(parameter)) {
        validationFailed = true;
        return true;
      }
    });
    if (validationFailed) {
      res
        .status(400)
        .json({ success: false, message: "Bad Request: Missing parameter " });
    } else {
      next();
    }
  };
};

module.exports.extractQueryParams = function (request) {
  return [
    request.query.page ? parseInt(request.query.page) : 1,
    request.query.limit ? parseInt(request.query.limit) : 10,
    request.query.filter ? atob(request.query.filter) : "",
  ];
};
module.exports.extractToken = async function (request) {
  const bearerHeader = request.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    return {
      success: true,
      message: "Token Verified successfully",
      token: bearerToken,
    };
  } else {
    return {
      success: false,
      message: "User not authorized",
    };
  }
};
