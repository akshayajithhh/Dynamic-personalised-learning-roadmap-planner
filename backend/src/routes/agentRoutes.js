import express from 'express';
import { chatWithAgent } from '../controllers/agentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', protect, chatWithAgent);

export default router;

