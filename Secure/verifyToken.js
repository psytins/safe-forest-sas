// Middleware to verify JWT
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/authentication');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/authentication');
        }
        //req.userId = decoded.userId;
        next();
    });
}

module.exports = verifyToken;