// middleware/validateInput.js
const validateRegistrationInput = (req, res, next) => {
    const { name, username, email, phoneNumber, password, confirmPassword } = req.body;
    let errors = {};
  
    if (!name) errors.name = "Name is required.";
    if (!username) errors.username = "Username is required.";
    if (!email) errors.email = "Email is required.";
    if (!phoneNumber) errors.phoneNumber = "Phone number is required.";
    if (!password) errors.password = "Password is required.";
    if (!confirmPassword) errors.confirmPassword = "Confirm password is required.";
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Validation errors occurred.",
        errors,
      });
    }



    
  
    next();  // If validation passes, proceed to the next middleware or controller function
  };
  
  module.exports = validateRegistrationInput;
  