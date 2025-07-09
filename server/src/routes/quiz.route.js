import express from 'express';
import upload from '../middleware/multer.middleware.js';
import { uploadPdf } from '../controller/quiz.controller.js';

const router = express.Router();

// POST /upload
router.post('/upload', upload.single('pdf'), uploadPdf);

export default router;
