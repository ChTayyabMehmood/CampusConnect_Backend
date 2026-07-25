const pool = require("../config/database");

class UserModel {
  // static
  // create user
  static async createUser({ email, password, first_name, last_name }) {
    const query = `insert into users(email, password,first_name,last_name) Values($1,$2,$3,$4) Returning id,first_name,last_name, role,is_verified`;

    const result = await pool.query(query, [
      email.toLowerCase().trim(),
      password,
      first_name,
      last_name,
    ]);
    return result.rows[0];
  }
  // find user by email
  static async findByEmail({ email }) {
    const query = `select * from users where email=$1`;
    const result = await pool.query(query, [email.toLowerCase().trim()]);
    return result.rows[0];
  }

  // create student profile
  static async createStudentProfile({
    user_id,
    college,
    graduation_year,
    major,
    skills,
  }) {
    const query = `insert into STUDENT_PROFILE(user_id,college,graduation_year,major,skills) Values($1,$2,$3,$4,$5) Returning *`;

    const result = await pool.query(query, [
      user_id,
      college,
      graduation_year,
      major,
      skills,
    ]);
    return result.rows[0];
  }

  //test routes for all usr
  static async allUser() {
    const query = `select email, first_name, last_name from users`;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = UserModel;
