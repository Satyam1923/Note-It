import pool from '../configs/database.js';
import { encryptSymmetric } from '../utils/aes.js';

export const duplicateNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.user_id;
        const result = await pool.query(
            'SELECT title, content FROM notes WHERE note_id = $1 AND user_id = $2',
            [noteId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Note not found",
                message: "The note you are trying to duplicate does not exist"
            });
        }

        let { title, content } = result.rows[0];
        let newTitle = title + " (copy)";
        let count = 1;

        while (true) {
            const checkTitle = await pool.query(
                'SELECT note_id FROM notes WHERE user_id = $1 AND title = $2',
                [userId, newTitle]
            );

            if (checkTitle.rows.length === 0) {
                break; 
            }
            newTitle = `${title} (copy ${count++})`;
        }

        const encryptedContent = encryptSymmetric(content);
        const insertResult = await pool.query(
            `INSERT INTO notes (user_id, title, content) 
            VALUES ($1, $2, $3) 
            RETURNING note_id, title, content, created_at`,
            [userId, newTitle, encryptedContent]
        );

        res.status(201).json({
            success: true,
            message: "Note duplicated successfully",
            note: insertResult.rows[0]
        });

    } catch (error) {
        console.error('Error duplicating note:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "Failed to duplicate note"
        });
    }
};
