const express = require("express");
const pool = require("./config/database");
const app = express();
const UserRoutes = require("./routes/user.routes");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use("/", UserRoutes);
app.use(errorHandler);

const startServer = async () => {
  try {
    const result = await pool.query("Select now()");
    console.log("db connected");

    app.listen(3000, () => {
      console.log("server is Start :)");
    });
  } catch (e) {
    console.error("Failed to start server:", e.message);
    process.exit(1);
  }
};

startServer();
