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
  //login
  static async login(req, res, next) {
    try {
      if (!req.body) {
        const error = Error("empty response");
        error.statusCode = 400;
        throw error;
      }

      const { email, password } = req.body;
      console.log("from controller: " + email, password);

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

  // onboarding (profile stepup : Universitydetails + skills)
  static async onboarding(req, res, next) {
    try {
      const logInUser = req.user;
      const { college, graduation_year, major, skills } = req.body;

      const onboarding = await UserService.onboarding({
        college,
        graduation_year,
        major,
        skills,
        user_id: logInUser.id,
      });
      res.status(onboarding.statusCode).json({
        success: onboarding.success,
        message: onboarding.message,
        data: onboarding.data || null,
      });
    } catch (error) {
      next(error);
    }
  }

  // feed -> all list of opporunities
  static async feed(req, res, next) {
    try {
      const logInUser = req.user;
      const feed = await UserService.feed();
      res.status(feed.statusCode).json({
        success: feed.success,
        message: feed.message,
        data: feed.data || null,
      });
    } catch (error) {
      next(error);
    }
  }

  // test route for all users
  static async allUser(req, res, next) {
    try {
      const users = await UserService.allUser();
      res.status(users.statusCode).json({
        success: users.success,
        message: users.message,
        data: users.data || null,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET OPPORTUNITY BY ID
  static async getOpportunityById(req, res, next) {
    try {
      const opportunityId = req.params.id;
      console.log("opportunityId: ", opportunityId);

      const opportunity = await UserService.getOpportunityById(opportunityId);

      res.status(opportunity.statusCode).json({
        success: opportunity.success,
        message: opportunity.message,
        data: opportunity.data || null,
      });
    } catch (error) {
      next(error);
    }
  }

  // APPLY FOR OPPORTUNITY
  static async applyOpportunity(req, res, next) {
    try {
      const logInUser = req.user;
      const opportunityId = req.params.id;
      const { message } = req.body;

      const apply = await UserService.applyOpportunity({
        user_id: logInUser.id,
        opportunity_id: opportunityId,
        message,
      });

      res.status(apply.statusCode).json({
        success: apply.success,
        message: apply.message,
        data: apply.data || null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
