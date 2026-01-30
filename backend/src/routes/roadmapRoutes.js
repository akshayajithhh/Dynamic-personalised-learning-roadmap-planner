import express from 'express';
const router = express.Router();
import { createRoadmap, getRoadmap, getSkillDetails } from '../controllers/roadmapController.js';

router.post('/generate', createRoadmap);
router.get('/:userId', getRoadmap);
router.get('/skill/:skillId', getSkillDetails);

export default router;
