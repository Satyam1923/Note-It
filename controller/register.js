import bcrypt from 'bcrypt';
import pool from '../configs/database.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, email, phonenumber, password } = req.body;
        if (!name || !email || !phonenumber || !password) {
            return res.status(400).json({
                error: "All fields are required",
                fields: { name, email, phonenumber, password }
            });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        const userExists = await pool.query(
            `SELECT 1 FROM users WHERE email = $1 OR phonenumber = $2 LIMIT 1`,
            [email, phonenumber]
        );

        if (userExists.rows.length > 0) {
            return res.status(409).json({ error: "Email or phone number already registered" });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }
        const hashedPassword = await bcrypt.hash(password, 12); 
        const newUser = await pool.query(
            `INSERT INTO users (name, email, phonenumber, password) 
             VALUES ($1, $2, $3, $4) 
             RETURNING user_id, email, name, phonenumber`,
            [name, email, phonenumber, hashedPassword]
        );
        const token = jwt.sign(
            {
                userId: newUser.rows[0].user_id,
                email: newUser.rows[0].email
            },
            process.env.SECRET_KEY,
            { expiresIn: '6h' } 
        );

        return res.status(201).json({
            message: "User registered successfully!",
            token,
            user: {
                id: newUser.rows[0].user_id,
                name: newUser.rows[0].name,
                email: newUser.rows[0].email,
                phonenumber: newUser.rows[0].phonenumber
            }
        });

    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({
            error: "Internal server error",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};