import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getNotes } from '../controller/getNoteController.js';
import { getNotesById } from '../controller/getNoteByIdController.js';
import { searchQuery } from '../controller/searchQueryController.js';
import { addNotes } from '../controller/addNotesController.js';
import { bulkAddNotes } from '../controller/bulkAddNoteController.js';
import { updateNotes } from '../controller/updateNotesController.js';
import { deleteNotes } from '../controller/deleteNotesController.js';
import { toggleFavouriteNote } from '../controller/toggleFavouriteNotesController.js';
import { generateShareLink } from '../controller/generateShareLinkController.js';
import { acceptSharedNote } from '../controller/acceptShareNote.js';

const router = express.Router();

router.get('/', authenticateToken, getNotes);
router.get('/search', authenticateToken, searchQuery);
router.get('/:id', authenticateToken, getNotesById);

router.post('/add', authenticateToken, addNotes);
router.post('/bulk-add', authenticateToken, bulkAddNotes);

router.patch('/update/:id', authenticateToken, updateNotes);

router.delete('/delete/:id', authenticateToken, deleteNotes);


router.get('/favourites/:id', authenticateToken, toggleFavouriteNote);
router.post('/share/:id', authenticateToken, generateShareLink);
router.post('/accept-share/:shareId', authenticateToken, acceptSharedNote);

export default router;
