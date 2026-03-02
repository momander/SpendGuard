async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split('Bearer ')[1];
    const parts = token.split('-');
    const roleToken = parts[0];
    const idToken = parts[1] || (roleToken === 'admin' ? 'admin_uid' : 'user_uid');
    if (roleToken === 'admin' || roleToken === 'user') {
        req.user = {
            uid: idToken,
            email: roleToken === 'admin' ? 'admin@example.com' : 'user@example.com',
            role: roleToken === 'admin' ? 'manager' : 'employee'
        };
        next();
    } else {
        return res.status(403).json({ error: 'Unauthorized: Invalid token' });
    }
}
module.exports = verifyToken;
