const emailRegax = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegax =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// validation function
const isEmail = (email) => {
  return emailRegax.test(email);
};

const isStrongPassword = (password) => {
  return passwordRegax.test(password);
};

const isFirstName = (first_name) => {
  if (first_name.length < 2 || first_name.length > 50) return false;
  return true;
};

const isLastName = (last_name) => {
  if (last_name.length < 2 || last_name.length > 50) return false;
  return true;
};

module.exports = { isEmail, isStrongPassword, isFirstName, isLastName };
