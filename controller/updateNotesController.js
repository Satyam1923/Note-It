import pool from '../configs/database.js';

export const updateNotes = async (req, res) => {
    try {
        const { email, noteId, title, content } = req.body;
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
        const updateResult = await pool.query(
            `UPDATE notes
            SET title = $1, content = $2
            WHERE note_id = $3 AND user_id = $4
            RETURNING note_id, title`,
            [title, content, noteId, userId]
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