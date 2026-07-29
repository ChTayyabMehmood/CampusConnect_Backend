const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const UserController = require("../controllers/user.controllers");

// routes
router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.post("/onboarding", userAuth, UserController.onboarding);
router.get("/feed", userAuth, UserController.feed);
router.get("/opportunity/:id", userAuth, UserController.getOpportunityById);
router.post("/apply/:id", userAuth, UserController.applyOpportunity);

// test routes all user
router.get("/alluser", UserController.allUser);

module.exports = router;
