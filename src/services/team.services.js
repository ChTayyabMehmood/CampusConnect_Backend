const TeamModel = require("../models/team.model");

class TeamService {
  async createTeam({ userId, teamName, teamDescription, members }) {
    // validate input
    if (!teamName || !teamDescription || !members) {
      return {
        success: false,
        message: "Missing required fields",
        statusCode: 400,
      };
    }

    if (members.length > 4) {
      return {
        success: false,
        message: "Team members cannot exceed 4",
        statusCode: 400,
      };
    }

    if (teamName.length > 255) {
      return {
        success: false,
        message: "Team name cannot exceed 255 characters",
        statusCode: 400,
      };
    }

    if (teamDescription.length > 1000) {
      return {
        success: false,
        message: "Team description cannot exceed 1000 characters",
        statusCode: 400,
      };
    }

    // Check if the user is already part of a team
    const existingTeam = await TeamModel.isUserInTeam({
      userId,
      teamId,
    });
    // Create the team
    const newTeam = await TeamModel.createTeam({
      name: teamName,
      description: teamDescription,
      members: members,
      created_by: userId,
    });
    return {
      success: true,
      message: "Team created successfully",
      data: newTeam,
      statusCode: 201,
    };
  }

  // join team

  async joinTeam({ userId, teamId }) {
    // validate input
    if (!teamId) {
      return {
        success: false,
        message: "Missing required fields",
        statusCode: 400,
      };
    }

    // Check if the user is already part of a team
    const existingTeamMember = await TeamModel.isUserInTeam({
      userId,
      teamId,
    });

    if (existingTeamMember) {
      return {
        success: false,
        message: "User is already part of a team",
        statusCode: 400,
      };
    }

    // Check if the team is full
    const isFull = await TeamModel.isTeamFull({ teamId });
    if (isFull) {
      return {
        success: false,
        message: "Team is full",
        statusCode: 400,
      };
    }

    // Join the team
    const result = await TeamModel.joinTeam({
      userId,
      teamId,
    });
    return {
      success: true,
      message: "Joined team successfully",
      data: result,
      statusCode: 200,
    };
  }
}

module.exports = TeamService;
