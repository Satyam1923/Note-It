import pool from '../configs/database.js';
import { encryptSymmetric } from '../utils/aes.js';


export const updateNotes = async (req, res) => {
    try {
        const { title, content } = req.body;
        const noteId = req.params.id;
        const userId = req.user.user_id;
        const encryptedContent = encryptSymmetric(content);
        const updateResult = await pool.query(
            `UPDATE notes
            SET title = $1, content = $2
            WHERE note_id = $3 AND user_id = $4
            RETURNING note_id, title`,
            [title, encryptedContent, noteId, userId]
        );

        if (updateResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: "Note not found",
                message: "No note found with the provided ID for this user"
            });
        }

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            deletedNote: updateResult.rows[0]
        });

    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "Failed to update note"
        });
    }
};