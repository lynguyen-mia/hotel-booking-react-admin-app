// VALIDATION FUNCTION
function validation(enteredEmail, enteredPassword) {
  let errors = {};

  if (!enteredEmail || !enteredPassword) {
    errors.blank = "Please fill out all fields.";
  }
  if (!enteredEmail.includes("@")) {
    errors.invalidEmail = "Please fill out a valid email.";
  }
  // Password has more than 6 characters
  if (enteredPassword.length < 6) {
    errors.invalidPassword = "Password must have more than 6 characters.";
  }
  return errors;
}

export default validation;
