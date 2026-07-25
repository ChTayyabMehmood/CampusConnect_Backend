const pool = require("../config/database");

class UserModel {
  // static

  static async createUser({ email, password, first_name, last_name }) {
    const query = `insert into users(email, password,first_name,last_name) Values($1,$2,$3,$4) Returning id,first_name,last_name, role,is_verified`;

    const result = await pool.query(query, [
      email,
      password,
      first_name,
      last_name,
    ]);
    return result.rows[0];
  }

  static async findByEmail({ email }) {
    const query = `select email from users where email=$1`;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }
}

module.exports = UserModel;
