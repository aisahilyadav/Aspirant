import express from 'express';
import { getSettings, updateSettings, updateProfile } from '../controller/settings.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect settings routes
router.use(authMiddleware);

router.get('/', getSettings);
router.put('/', updateSettings);
router.put('/profile', updateProfile);

export default router;
