import express from 'express';
import {register} from '../controller/registerController.js';
import { login } from '../controller/loginController.js';
import { removeUser } from '../controller/removeUserController.js';
import { authenticateToken } from '../middleware/auth.js';
import { logout } from '../controller/logoutController.js';

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);
router.delete('/delete',authenticateToken,removeUser);

export default router;