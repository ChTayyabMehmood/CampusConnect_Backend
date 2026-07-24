const UserModel = require("../models/user.model");
class UserService {
  // ✅ Business Logic Here
  // Validation, hashing, token generation, error handling

  static async register({ email, password, first_name, last_name }) {
    // 1. Validate input
    if (!email || !password || !first_name || !last_name) {
      throw new Error("All fields are required");
    }
    // create user
    const user = await UserModel.createUser({
      email,
      password,
      first_name,
      last_name,
    });
    // delete password
    delete user.password;

    return user;
  }
}

module.exports = UserService;
