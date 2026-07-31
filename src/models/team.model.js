const pool = require("../config/database");

class TeamModel {
  static async createTeam({ name, description, members, created_by }) {
    const query = `INSERT INTO teams (name, description, members, created_by) VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(query, [
      name,
      description,
      members,
      created_by,
    ]);
    return result.rows[0];
  }

  static async isUserInTeam({ userId, teamId }) {
    const query = `SELECT * FROM TEAMMEMBER WHERE $1 = user_id AND $2 = team_id`;
    const result = await pool.query(query, [userId, teamId]);
    return result.rows.length > 0;
  }

  static async isTeamFull({ teamId }) {
    const query = `
        SELECT
            t.max_members,
            COUNT(tm.id) AS current_members
        FROM TEAM t
        LEFT JOIN TEAMMEMBER tm
            ON tm.team_id = t.id
            AND tm.status = 'active'
        WHERE t.id = $1
        GROUP BY t.id, t.max_members;
    `;

    const { rows } = await pool.query(query, [teamId]);

    if (rows.length === 0) {
      throw new Error("Team not found");
    }

    const { max_members, current_members } = rows[0];

    return Number(current_members) >= max_members;
  }

  static async joinTeam({ userId, teamId }) {
    const query = `INSERT INTO TEAMMEMBER (user_id, team_id) VALUES ($1, $2) RETURNING *`;
    const result = await pool.query(query, [userId, teamId]);
    return result.rows[0];
  }
}

module.exports = TeamModel;
