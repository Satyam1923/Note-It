import pool from '../configs/database.js';

export const generateShareLink = async (req, res) => {
    try {
        const { id } = req.params; 
        const userId = req.user.user_id;
        const result = await pool.query(
            `UPDATE notes 
             SET share_id = gen_random_uuid() 
             WHERE user_id = $1 AND note_id = $2 
             RETURNING share_id`,
            [userId, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        const shareId = result.rows[0].share_id;
        const shareLink = `${process.env.FRONTEND_URL}/share/${shareId}`;

        res.json({ success: true, shareLink });
    } catch (error) {
        console.error("Error generating share link:", error);
        res.status(500).json({ success: false, message: "Failed to generate share link" });
    }
};
