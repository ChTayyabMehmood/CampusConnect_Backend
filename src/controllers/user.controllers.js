// This file handles request/response. It receives HTTP requests, calls the service, and sends back HTTP responses.

const UserService = require("../services/user.services");

class UserController {
  // Signup Controller: take request and send back response
  static async signup(req, res, next) {
    try {
      if (!req.body) {
        return res
          .status(400)
          .json({ success: false, message: "Request body is missing" });
      }

      const { email, password, first_name, last_name } = req.body;
      const result = await UserService.register({
        email,
        password,
        first_name,
        last_name,
      });

      res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      if (!req.body) {
        const error = Error("empty response");
        error.statusCode = 400;
        throw error;
      }

      const { email, password } = req.body;
      const result = await UserService.login({ email, password });

      res.cookie("token", result.token);

      res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
