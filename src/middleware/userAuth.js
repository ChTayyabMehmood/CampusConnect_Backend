const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decodedToken = await jwt.verify(token, "shhhhh");
    const { email } = decodedToken;
    const User = await UserModel.findByEmail({ email });
    if (!User) {
      const error = Error("login failed");
      error.statusCode = 401;
      throw error;
    }
    req.user = User; //send user as req, so didnot need to call again db;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userAuth;
