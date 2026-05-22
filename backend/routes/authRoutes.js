import express from 'express';
import { register, login, googleLogin } from '../controllers/authController.js';

const router = express.Router();

// Public auth endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);

export default router;
