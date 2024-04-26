const crypto = require('crypto');

function generateRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

const secretKey = generateRandomString(32); // 32 characters (256 bits) as an example

module.exports = secretKey;