import express from 'express';
import { getUsers } from '../controller/usersController.js';
import {register} from '../controller/register.js';
import { login } from '../controller/login.js';

const router = express.Router();

router.get('/users',getUsers);
router.post('/regsiter',register);
router.post('/login',login);

export default router;