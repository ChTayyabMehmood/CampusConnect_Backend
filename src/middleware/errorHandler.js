const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  console.log("ERROR: " + error.message);
  res.status(statusCode).send({ success: false, message: message });
};

module.exports = errorHandler;
