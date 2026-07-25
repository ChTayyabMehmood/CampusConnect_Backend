const emailRegax = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegax =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const isEmail = (email) => {
  return emailRegax.test(email);
};

const isStrongPassword = (password) => {
  return passwordRegax.test(password);
};

module.exports = { isEmail, isStrongPassword };
