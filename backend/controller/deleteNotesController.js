import express from 'express';
import pool from '../configs/database.js';

export const deleteNotes = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.user_id;
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