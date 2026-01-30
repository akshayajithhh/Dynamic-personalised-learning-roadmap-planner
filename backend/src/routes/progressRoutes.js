import express from 'express';
const router = express.Router();
import { updateProgress, getProgress } from '../controllers/progressController.js';

router.post('/update', updateProgress);
router.get('/:userId', getProgress);

export default router;
