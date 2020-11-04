const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const libCommon = require("../lib/common");

module.exports.createUser = async function (request) {
  let newUser = new User(request.body);
  try {
    const savedUser = await newUser.save();
    const token = await libCommon.generateToken(savedUser);
    return {
      success: true,
      status: 201,
      message: "User created successfully",
      data: savedUser,
      token: token,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: error,
    };
  }
};

module.exports.login = async function (request) {
  try {
    const user = await User.findOne({ email: request.body.email });
    const isAuthenticated = await user.comparePassword(request.body.password);
    if (isAuthenticated === true) {
      const token = await libCommon.generateToken(user);
      const data = {
        user: user,
      };
      return {
        success: true,
        status: 200,
        message: "User authenticated successfully",
        data: data,
        token: token,
        returnUrl: request.query.returnUrl,
      };
    } else {
      return {
        success: false,
        status: 401,
        message: "Email and password do not match",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "User not found",
    };
  }
};

module.exports.updateUser = async function (request) {
  try {
    const jwtVerifiedData = jwt.verify(request.token, "secretKey");
    if (jwtVerifiedData.id === request.params.id) {
      const userToUpdate = await User.findOne({ _id: request.params.id });
      await User.updateOne(
        { _id: userToUpdate["_id"] },
        { $set: request.body },
        { new: true }
      );
      const updatedUser = await User.findOne({ _id: userToUpdate["_id"] });
      return {
        success: true,
        status: 200,
        message: "User updated successfully",
        data: updatedUser,
      };
    } else {
      return {
        success: false,
        status: 403,
        message: "User not authorized",
      };
    }
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return {
        success: false,
        status: 403,
        message: error,
      };
    }
    return {
      success: false,
      status: 500,
      message: error,
    };
  }
};

module.exports.getUser = async function (request) {
  try {
    const jwtVerifiedData = jwt.verify(request.token, "secretKey");
    if (
      jwtVerifiedData.id === request.params.id ||
      jwtVerifiedData.type === "admin"
    ) {
      const user = await User.findOne({ _id: request.params.id });
      const data = {
        user: user,
      };
      return {
        success: true,
        status: 200,
        message: "User fetched successfully",
        data: data,
      };
    }
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return {
        success: false,
        status: 403,
        message: error,
      };
    }
    return {
      success: false,
      status: 500,
      message: error,
    };
  } finally {
    session.close();
  }
};

// module.exports.getAllUsers = async function (request) {
//   const driver = libDb.neo4jConnect();
//   const session = driver.session();
//   try {
//     const jwtVerifiedData = jwt.verify(request.token, "secretKey");
//     if (jwtVerifiedData.type === "admin") {
//       let page, limit, filter;
//       [page, limit, filter] = libCommon.extractQueryParams(request);
//       const count = await User.find({ name: new RegExp(filter, "i") }).count();
//       page = count <= limit ? 1 : page;
//       const users = await User.find({ name: new RegExp(filter, "i") })
//         .skip((page - 1) * limit)
//         .limit(limit);
//       return {
//         success: true,
//         status: 200,
//         message: "Users fetched successfully",
//         data: {
//           users: users,
//           pageCount: Math.ceil(count / limit),
//           totalCount: count,
//           currentPage: page,
//         },
//       };
//     } else {
//       return {
//         success: false,
//         status: 403,
//         message: "User not authorized",
//       };
//     }
//   } catch (error) {
//     if (
//       error.name === "JsonWebTokenError" ||
//       error.name === "TokenExpiredError"
//     ) {
//       return {
//         success: false,
//         status: 403,
//         message: error,
//       };
//     }
//     return {
//       success: false,
//       status: 500,
//       message: error,
//     };
//   } finally {
//     session.close();
//   }
// };
// async function asyncForEach(array, callback) {
//   for (let index = 0; index < array.length; index++) {
//     await callback(array[index], index, array);
//   }
// }
