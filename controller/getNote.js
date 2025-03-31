import express from 'express';
import pool from '../configs/database.js';

export const getNotes = async (req, res) => {
    try {
        const { email } = req.body;
        const userResult = await pool.query(
            'SELECT user_id FROM users WHERE email = $1',
            [email]
        );
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const userId = userResult.rows[0].user_id;
        const notesResult = await pool.query(
            'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        res.status(200).json({
            user: userResult.rows[0],
            notes: notesResult.rows
        });

    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: "Failed to fetch notes" });
    }
};