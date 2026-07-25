const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const UserController = require("../controllers/user.controllers");

// routes
router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.post("/onboarding", userAuth, UserController.onboarding);

// test routes all user
router.get("/alluser", UserController.allUser);

module.exports = router;
