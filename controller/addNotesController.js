import pool from '../configs/database.js';
import { encryptSymmetric } from '../utils/aes.js';

export const addNotes = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.user_id;
        const existingNote = await pool.query(
            'SELECT note_id FROM notes WHERE user_id = $1 AND title = $2',
            [userId, title]
        );

        if (existingNote.rows.length > 0) {
            return res.status(409).json({
                success: false,
                error: "Duplicate note",
                message: "A note with this title already exists for this user"
            });
        }
        const encryptedContent = encryptSymmetric(content);
        const insertResult = await pool.query(
            `INSERT INTO notes (user_id, title, content) 
             VALUES ($1, $2, $3) 
             RETURNING note_id, title, content, created_at`,
            [userId, title, encryptedContent]
        );

        res.status(201).json({
            success: true,
            message: "Note added successfully",
            note: insertResult.rows[0]
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
