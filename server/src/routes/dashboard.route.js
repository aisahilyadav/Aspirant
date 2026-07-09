import express from 'express';
import { getDashboardData } from '../controller/dashboard.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth protection to all dashboard endpoints
router.use(authMiddleware);

router.get('/', getDashboardData);

export default router;
