const jwt = require('jsonwebtoken');
const secretKey = require('./keyGeneration');

function generateAuthToken(user) {
  console.log("User payload: " + user);

  const payload = {
    user_id: user.id,
    // Add other user-related information as needed
  };

  // Set token option
  const options = {
    expiresIn: '1h', // Token will expire in 1 hour
  };

  // Sign the token with the secret key
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  return token;
}

module.exports = generateAuthToken;