const TeamService = require("../services/team.services");
class TeamController {
  //create team
  async createTeam(req, res) {
    try {
      const { teamName, teamDescription, members } = req.body;
      const userId = req.user.id;

      // Call the service method to create a team
      const newTeam = await TeamService.createTeam({
        userId,
        teamName,
        teamDescription,
        members,
      });

      res.status(newTeam.statusCode).json({
        success: newTeam.success,
        message: newTeam.message,
        data: newTeam.data,
      });
    } catch (error) {
      next(error);
    }
  }

  // join team
  async joinTeam(req, res) {
    try {
      const { teamId } = req.params;
      const userId = req.user.id;

      // Call the service method to join a team
      const result = await TeamService.joinTeam({ userId, teamId });

      res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TeamController;
