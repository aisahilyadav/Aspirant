import express from 'express';
import { signPdfUpload } from '../controller/upload.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/signature', signPdfUpload);

export default router;
