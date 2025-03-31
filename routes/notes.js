import express from 'express';
import {getNotes} from '../controller/getNote.js'
import { authenticateToken } from '../middleware/auth.js';
import { addNotes } from '../controller/addNotes.js';
import { deleteNotes } from '../controller/deleteNotes.js';

const router = express.Router();

router.get('/', authenticateToken,getNotes);
router.post('/add',authenticateToken,addNotes);
router.delete('/delete',authenticateToken,deleteNotes);
export default router;