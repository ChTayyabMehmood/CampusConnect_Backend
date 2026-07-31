const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const TeamController = require("../controllers/team.controllers");

router.post("/createTeam", userAuth, TeamController.createTeam);
router.post("/joinTeam/:teamId/", userAuth, TeamController.joinTeam);

module.exports = router;
