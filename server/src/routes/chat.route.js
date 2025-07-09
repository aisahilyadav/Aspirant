// ─── routes/chat.route.js ──────────────────────────────────────
import express from 'express';
import { chat } from '../controller/quiz.controller.js';

const router = express.Router();

router.post('/chat', chat);

export default router;
