const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  isEmail,
  isStrongPassword,
  isFirstName,
  isLastName,
  isSkills,
  isMajor,
  isYear,
  Iscollege,
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

    // generate token
    const token = await jwt.sign({ email: email }, "shhhhh", {
      expiresIn: "1h",
    });

    return {
      success: true,
      message: "User login successfully",
      data: { email: user.email, id: user.id, first_name: user.first_name },
      statusCode: 200,
      token,
    };
  }

  // onboarding
  static async onboarding({
    college,
    graduation_year,
    major,
    skills,
    user_id,
  }) {
    // validation
    if (!Iscollege(college)) {
      const error = Error("invalid college name");
      error.statusCode = 400;
      throw error;
    }
    if (!isYear(graduation_year)) {
      const error = Error("invalid graduation year");
      error.statusCode = 400;
      throw error;
    }
    if (!isMajor(major)) {
      const error = Error("invalid major name");
      error.statusCode = 400;
      throw error;
    }
    if (!isSkills(skills)) {
      const error = Error("invalid skills");
      error.statusCode = 400;
      throw error;
    }
    // Business Logic

    const studentProfile = await UserModel.createStudentProfile({
      college,
      graduation_year,
      major,
      skills,
      user_id,
    });

    return {
      success: true,
      message: "student profile created successfully",
      data: studentProfile,
      statusCode: 201,
    };
  }

  static async feed() {
    // Business Logic
    const feed = await UserModel.getFeed();

    return {
      success: true,
      message: "feed retrieved successfully",
      data: feed,
      statusCode: 200,
    };
  }

  //test route for all users
  static async allUser() {
    const users = await UserModel.allUser();
    return {
      success: true,
      message: "All users retrieved successfully",
      data: users,
      statusCode: 200,
    };
  }
  // get opportunity detail by id
  static async getOpportunityById({ opportunityId }) {
    // Business Logic
    const opportunity = await UserModel.getOpportunityById(opportunityId);

    if (!opportunity) {
      return {
        success: false,
        message: "Opportunity not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Opportunity retrieved successfully",
      data: opportunity,
      statusCode: 200,
    };
  }

  // apply opportunity by id
  static async applyOpportunity({ user, opportunity_id, message }) {
    // validation rules
    if (!user.id || !opportunity_id) {
      const error = new Error("User ID and Opportunity ID are required");
      error.statusCode = 400;
      throw error;
    }

    // Check if the opportunity exists
    const opportunity = await UserModel.getOpportunityById(opportunity_id);
    if (!opportunity) {
      return {
        success: false,
        message: "Opportunity not found",
        statusCode: 404,
      };
    }

    // Check if the user has already applied for this opportunity
    const existingApplication = await UserModel.checkExistingApplication(
      opportunity_id,
      user.id,
    );

    if (existingApplication) {
      return {
        success: false,
        message: "You have already applied for this opportunity",
        statusCode: 400,
      };
    }

    // message validation
    if (message && message.length > 500) {
      return {
        success: false,
        message: "Message should not exceed 500 characters",
        statusCode: 400,
      };
    }

    // Business Logic

    const application = await UserModel.applyOpportunity({
      user_id: user.id,
      opportunity_id,
      message,
    });

    return {
      success: true,
      message: "Application submitted successfully",
      data: application,
      statusCode: 201,
    };
  }

  // save opportunity (favorite)
  static async SaveOpportunity({ user, opportunity_id }) {
    // validation rules
    if (!user.id || !opportunity_id) {
      const error = new Error("User ID and Opportunity ID are required");
      error.statusCode = 400;
      throw error;
    }

    // Check if the opportunity exists
    const opportunity = await UserModel.getOpportunityById(opportunity_id);
    if (!opportunity) {
      return {
        success: false,
        message: "Opportunity not found",
        statusCode: 404,
      };
    }

    // Check if the user has already saved this opportunity
    const existingSave = await UserModel.checkExistingSave(
      opportunity_id,
      user.id,
    );

    if (existingSave) {
      return {
        success: false,
        message: "You have already saved this opportunity",
        statusCode: 400,
      };
    }

    // Business Logic

    const save = await UserModel.saveOpportunity({
      user_id: user.id,
      opportunity_id,
    });

    return {
      success: true,
      message: "Opportunity saved successfully",
      data: save,
      statusCode: 201,
    };
  }
}

module.exports = UserService;
