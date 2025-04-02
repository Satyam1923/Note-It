import pool from '../configs/database.js';
import { decryptSymmetric } from '../utils/aes.js';

export const getNotesById = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const noteId = req.params.id;
        const notesResult = await pool.query(
            'SELECT * FROM notes WHERE user_id = $1 AND note_id = $2',
            [userId, noteId]
        );


        const decryptedNotes = notesResult.rows.map((note) => {
            return {
                note_id: note.note_id,
                user_id: note.user_id,
                title: note.title,
                content: decryptSymmetric(note.content),
                created_at: note.created_at,
                updated_at: note.updated_at
            };
        });
        res.status(200).json({
            user: userId,
            notes: decryptedNotes
        });

    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ error: "Failed to fetch note" });
    }
};