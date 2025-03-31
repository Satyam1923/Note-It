import express from 'express';
import {getNotes} from '../controller/getNoteController.js'
import { authenticateToken } from '../middleware/auth.js';
import { addNotes } from '../controller/addNotesController.js';
import { deleteNotes } from '../controller/deleteNotesController.js';
import {updateNotes} from '../controller/updateNotesController.js'

const router = express.Router();

router.get('/', authenticateToken,getNotes);
router.post('/add',authenticateToken,addNotes);
router.delete('/delete/:id', authenticateToken, deleteNotes);
router.patch('/update/:id',authenticateToken,updateNotes);

export default router;