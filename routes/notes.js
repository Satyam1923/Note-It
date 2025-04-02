import express from 'express';
import {getNotes} from '../controller/getNoteController.js'
import { authenticateToken } from '../middleware/auth.js';
import { addNotes } from '../controller/addNotesController.js';
import { deleteNotes } from '../controller/deleteNotesController.js';
import {updateNotes} from '../controller/updateNotesController.js'
import { getNotesById } from '../controller/getNoteByIdController.js';
import { searchQuery } from '../controller/searchQueryController.js';

const router = express.Router();

router.get('/', authenticateToken, getNotes);
router.get('/search', authenticateToken, searchQuery);
router.get('/:id', authenticateToken, getNotesById);
router.post('/add', authenticateToken, addNotes);
router.patch('/update/:id', authenticateToken, updateNotes);
router.delete('/delete/:id', authenticateToken, deleteNotes);

export default router;