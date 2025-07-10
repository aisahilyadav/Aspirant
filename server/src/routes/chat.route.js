// ─── routes/chat.route.js ──────────────────────────────────────
import express from 'express';
import upload from '../middleware/multer.middleware.js';
import { uploadPdf } from '../controller/chat.controller.js';
import { chat } from '../controller/chat.controller.js';

const router = express.Router();
router.post('/upload', upload.single('pdf'), uploadPdf);
router.post('/chat', chat);

export default router;
