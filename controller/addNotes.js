import express from 'express';
import pool from '../configs/database.js';

export const addNotes = async (req, res) => {
    try {
        const { email, title, content } = req.body;
        if (!email || !title || !content) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
                message: "Email, title, and content are all required"
            });
        }
        const userResult = await pool.query(
            'SELECT user_id FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "User not found",
                message: "No user exists with the provided email"
            });
        }

        const userId = userResult.rows[0].user_id;
        const insertResult = await pool.query(
            `INSERT INTO notes (user_id, title, content) 
             VALUES ($1, $2, $3) 
             RETURNING note_id, title, content, created_at`,
            [userId, title, content]
        );
        res.status(201).json({
            success: true,
        });

    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "Failed to add note"
        });
    }
};