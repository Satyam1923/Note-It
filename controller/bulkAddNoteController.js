import pool from '../configs/database.js';
import { encryptSymmetric } from '../utils/aes.js';

export const bulkAddNotes = async (req, res) => {
    try {
        const { inputList } = req.body;
        const userId = req.user.user_id;

        const results = [];

        for (const input of inputList) {
            const { title, content } = input;
            const existingNote = await pool.query(
                'SELECT note_id FROM notes WHERE user_id = $1 AND title = $2',
                [userId, title]
            );

            if (existingNote.rows.length > 0) {
                results.push({
                    title,
                    success: false,
                    error: "Duplicate note",
                    message: "A note with this title already exists for this user"
                });
                continue; 
            }
            const encryptedContent = encryptSymmetric(content);
            const insertResult = await pool.query(
                `INSERT INTO notes (user_id, title, content) 
                 VALUES ($1, $2, $3) 
                 RETURNING note_id, title, content, created_at`,
                [userId, title, encryptedContent]
            );

            results.push({
                success: true,
                message: "Note added successfully",
                note: insertResult.rows[0]
            });
        }

        res.status(201).json({
            success: true,
            message: "Bulk notes processing completed",
            results
        });

    } catch (error) {
        console.error('Error adding notes:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "Failed to add notes"
        });
    }
};
