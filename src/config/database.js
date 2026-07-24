const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // optional: max number of clients in the pool
  idleTimeoutMillis: 30000, // optional: close idle clients after 30s
  connectionTimeoutMillis: 2000, // optional: fail fast if no connection
});

module.exports = pool;
