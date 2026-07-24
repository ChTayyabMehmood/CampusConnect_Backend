const pool = require("./config/database");
async function test() {
  try {
    const result = await pool.query("Select Now()");
    console.log("db connected");
  } catch (e) {
    console.log(e.message);
  }
}

test();
