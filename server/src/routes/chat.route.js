// ─── routes/chat.route.js ──────────────────────────────────────
import express from 'express';
import { uploadPdf } from '../controller/chat.controller.js';
import { chat } from '../controller/chat.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/upload', authMiddleware, uploadPdf);
router.post('/chat', authMiddleware, chat);

export default router;
