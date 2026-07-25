const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  isEmail,
  isStrongPassword,
  isFirstName,
  isLastName,
} = require("../utils/validation");

class UserService {
  // Validation, hashing, token generation, error handling

  static async register({ email, password, first_name, last_name }) {
    // 1. Validate input
    if (!email || !password || !first_name || !last_name) {
      const error = new Error("all field are Required");
      error.statusCode = 400;
      throw error;
    }
    if (!isEmail(email)) {
      const error = new Error("invalid email format");
      error.statusCode = 400;
      throw error;
    }
    if (!isStrongPassword(password)) {
      const error = new Error("invalid password format");
      error.statusCode = 400;
      throw error;
    }
    if (!isFirstName(first_name)) {
      const error = new Error("first name should in Required Length");
      error.statusCode = 400;
      throw error;
    }
    if (!isLastName(last_name)) {
      const error = new Error("last name should in Required length");
      error.statusCode = 400;
      throw error;
    }

    // Business Logic
    // check if use already exit
    const exitingUser = await UserModel.findByEmail({ email });
    if (exitingUser) {
      return {
        success: false,
        message: "Email already exists",
        statusCode: 409,
      };
    }

    // hashPassword
    const saltRound = 1;
    const hashPassword = await bcrypt.hash(password, saltRound);

    // create user
    const user = await UserModel.createUser({
      email,
      password: hashPassword,
      first_name,
      last_name,
    });

    // delete password
    delete user.password;

    return {
      success: true,
      message: "user created successfully",
      data: user,
      statusCode: 201,
    };
  }

  static async login({ email, password }) {
    if (!isEmail(email)) {
      const error = Error("invalid email format");
      error.statusCode = 400;
      throw error;
    }

    // find email & password from db
    const user = await UserModel.findByEmail({ email });
    if (!user) {
      const error = Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // compare password;
    const isLogin = await bcrypt.compare(password, user.password);

    if (!isLogin) {
      const error = Error("invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const token = await jwt.sign({ email: email }, "shhhhh", {
      expiresIn: "1h",
    });

    return {
      success: true,
      message: "User login successfully",
      data: { email: user.email, first_name: user.first_name },
      statusCode: 200,
      token,
    };
  }
  catch(error) {
    next(error);
  }
}

module.exports = UserService;
