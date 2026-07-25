const UserModel = require("../models/user.model");
const { isEmail, isStrongPassword } = require("../utils/validation");
class UserService {
  // ✅ Business Logic Here
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

    // Business Logic
    // check if use already exit
    const exitingUser = await UserModel.findByEmail({ email });
    if (exitingUser)
      return {
        success: false,
        message: "Email already exists",
        statusCode: 409,
      };

    // create user
    const user = await UserModel.createUser({
      email,
      password,
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
}

module.exports = UserService;
