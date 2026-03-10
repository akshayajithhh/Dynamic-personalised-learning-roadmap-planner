import express from 'express';
const router = express.Router();
import { createRoadmap, getRoadmap, getSkillDetails, listUserRoadmaps } from '../controllers/roadmapController.js';

router.post('/generate', createRoadmap);
router.get('/user/:userId/all', listUserRoadmaps);
router.get('/skill/:skillId', getSkillDetails);
router.get('/:userId', getRoadmap);

export default router;
