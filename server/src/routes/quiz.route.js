import express from 'express';
import { uploadPdf, generateQuiz, submitQuiz } from '../controller/quiz.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';



const router = express.Router();

router.use(authMiddleware);
router.post('/upload', uploadPdf);
router.post('/generateQuiz', generateQuiz);
router.post('/submitQuiz', submitQuiz);

export default router;
