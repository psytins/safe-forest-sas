// Middleware to verify JWT
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.redirect('/authentication');
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.redirect('/authentication');
        }
        req.userId = decoded.userId;
        next();
    });
}

module.exports = verifyToken;