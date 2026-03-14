const jwt = require('jsonwebtoken');

// This function is our "security guard"
module.exports = function (req, res, next) {
  // 1. Get the token from the request header
  const token = req.header('x-auth-token');

  // 2. If no token is sent, deny access
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. If there is a token, try to verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. If token is valid, add the user's ID to the request object
    req.user = decoded.user;
    
    // 5. Tell the request to continue to its original destination
    next();
  } catch (err) {
    // If token is invalid (e.g., expired or tampered with)
    res.status(401).json({ msg: 'Token is not valid' });
  }
};