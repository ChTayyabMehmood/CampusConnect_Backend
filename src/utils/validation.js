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

// onboarding Validation
const Iscollege = (name) => {
  if (name.length < 1 || name.length > 200) return false;
  return true;
};

const isYear = (year) => {
  if (year < 0 || year > 4) return false;
  return true;
};
const isMajor = (major) => {
  if (major.length < 1 || major.length > 90) return false;
  return true;
};
const isSkills = (skillArray) => {
  if (!skillArray || !Array.isArray(skillArray)) return false;
  if (skillArray.length < 1 || skillArray.length > 10) return false;

  const isValid = skillArray.every(
    (skill) =>
      typeof skill === "string" && skill.length >= 1 && skill.length <= 50,
  );
  return isValid;
};

module.exports = {
  isEmail,
  isStrongPassword,
  isFirstName,
  isLastName,
  Iscollege,
  isYear,
  isMajor,
  isSkills,
};
