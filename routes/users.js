import express from 'express';
import { getUsers } from '../controller/usersController.js';
import {register} from '../controller/register.js';
import { login } from '../controller/login.js';
import { removeUser } from '../controller/removeUser.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/',getUsers);
router.post('/register',register);
router.post('/login',login);
router.delete('/delete',authenticateToken,removeUser);

export default router;