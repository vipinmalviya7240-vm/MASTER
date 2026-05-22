import express from 'express';
import { saveQuizResult, getQuizHistory } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/create', saveQuizResult);
router.get('/history', getQuizHistory);

export default router;
