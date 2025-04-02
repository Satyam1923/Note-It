import bcrypt from 'bcrypt';
import pool from '../configs/database.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const data = await pool.query(`SELECT * FROM users WHERE email = $1;`, [email]);
        const user = data.rows;

        if (user.length === 0) {
            return res.status(400).json({ error: "User is not registered, Sign Up first" });
        }
        const isMatch = await bcrypt.compare(String(password), user[0].password);
        if (!isMatch) {
            return res.status(400).json({ error: "Enter correct password!" });
        }
        const token = jwt.sign({ email: email }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({
            message: "User signed in!",
            token: token,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Database error occurred while signing in!" });
    }
};
