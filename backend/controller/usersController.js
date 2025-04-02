import pool from '../configs/database.js';

export const getUsers = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM users');
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
