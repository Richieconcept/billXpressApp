// utils/generateVerificationToken.js

const generateVerificationToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit token
  };
  
  module.exports = generateVerificationToken;
  