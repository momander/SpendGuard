async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    if (token === 'admin' || token === 'user') {
        req.user = {
            uid: token === 'admin' ? 'admin_uid' : 'user_uid',
            email: token === 'admin' ? 'admin@example.com' : 'user@example.com',
            role: token === 'admin' ? 'manager' : 'employee'
        };
        next();
    } else {
        return res.status(403).json({ error: 'Unauthorized: Invalid token' });
    }
}

module.exports = verifyToken;
