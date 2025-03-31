import bcrypt from 'bcrypt'; 
import pool from '../configs/database.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, email, phonenumber, password } = req.body;

        if (!name || !email || !phonenumber || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const data = await pool.query(`SELECT * FROM users WHERE email=$1;`, [email]);
        if (data.rows.length !== 0) {
            return res.status(400).json({ error: "Email already exists." });
        }
        const hashedPassword = await bcrypt.hash(String(password), 10);
        await pool.query(
            `INSERT INTO users (name, email, phonenumber, password) VALUES ($1, $2, $3, $4);`,
            [name, email, phonenumber, hashedPassword]
        );
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ message: "User registered successfully!", token });

    } catch (err) {
        console.error("Error in register function:", err);
        return res.status(500).json({ error: "Server error during registration" });
    }
};
    