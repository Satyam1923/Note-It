import pool from '../configs/database.js';

export const toggleFavouriteNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.user_id;

        const toggleResult = await pool.query(
            `UPDATE notes 
             SET favourite = NOT favourite 
             WHERE user_id = $1 AND note_id = $2 
             RETURNING note_id, title, content, favourite, created_at`,
            [userId, noteId]
        );

        if (toggleResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found or unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            message: "Note favourite status toggled successfully",
            note: toggleResult.rows[0]
        });

    } catch (error) {
        console.error('Error toggling favourite note:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "Failed to toggle favourite note"
        });
    }
};
