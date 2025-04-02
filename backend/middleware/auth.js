import jwt from 'jsonwebtoken';
import pool from '../configs/database.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: "Authorization token required" });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const { rows: [user] } = await pool.query(
            'SELECT user_id, email FROM users WHERE email = $1',
            [decoded.email] 
        );
        if (!user) {
            return res.status(403).json({ error: "User no longer exists" });
        }
        req.user = user;
        next();

    } catch (err) {
        console.error("Authentication error:", err);

        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: "Invalid token" });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ error: "Token expired" });
        }

        res.status(500).json({ error: "Authentication failed" });
    }
};