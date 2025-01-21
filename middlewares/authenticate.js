// middleware/authenticate.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: "Access denied." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach decoded user to the request object
    next();  // Proceed to the next middleware/handler
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authenticate;
