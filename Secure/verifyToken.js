// Middleware to verify JWT
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ redirectTo: '/authentication' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ redirectTo: '/authentication' });
        }
        req.userId = decoded.userId;
        next();
    });
}

module.exports = verifyToken;