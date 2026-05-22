import express from 'express';
import { chat, generateQuiz, summarizeNotes, generateFlashcards } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply double-layer JWT/Firebase ID protection to all AI requests
router.use(protect);

router.post('/chat', chat);
router.post('/quiz', generateQuiz);
router.post('/notes', summarizeNotes);
router.post('/flashcards', generateFlashcards);

export default router;
