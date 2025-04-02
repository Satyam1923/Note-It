import pool from '../configs/database.js';

export const acceptSharedNote = async (req, res) => {
    try {
        const { shareId } = req.params;
        const userId = req.user.user_id;

        const noteResult = await pool.query(
            `SELECT title, content FROM notes WHERE share_id = $1`,
            [shareId]
        );

        if (noteResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Shared note not found" });
        }

        const { title, content } = noteResult.rows[0];

        const insertResult = await pool.query(
            `INSERT INTO notes (user_id, title, content) 
             VALUES ($1, $2, $3) 
             RETURNING note_id, title, content, created_at`,
            [userId, title, content]
        );

        res.status(201).json({
            success: true,
            message: "Note added successfully from shared link",
            note: insertResult.rows[0]
        });

    } catch (error) {
        console.error("Error accepting shared note:", error);
        res.status(500).json({ success: false, message: "Failed to add shared note" });
    }
};
