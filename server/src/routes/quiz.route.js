import express from 'express';
import { uploadPdf, generateQuiz, submitQuiz } from '../controller/quiz.controller.js';
import upload from '../middleware/multer.middleware.js';



const router = express.Router();

router.post('/upload', upload.single('pdf'), uploadPdf);
router.post('/generateQuiz', generateQuiz);
router.post('/submitQuiz', submitQuiz);

export default router;
