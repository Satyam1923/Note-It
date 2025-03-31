import express from 'express';
import pool from '../configs/database.js';

export const deleteNotes = async (req, res) => {
    try {
        const { email, noteId } = req.body; 
        if (!email || !noteId) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
                message: "Email and note ID are required"
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
        const deleteResult = await pool.query(
            `DELETE FROM notes
             WHERE note_id = $1 AND user_id = $2
             RETURNING note_id, title`,
            [noteId, userId]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: "Note not found",
                message: "No note found with the provided ID for this user"
            });
        }

        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            deletedNote: deleteResult.rows[0]
        });

    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "Failed to delete note"
        });
    }
};