import express from 'express';
import {
    createModule,
    createResource,
    createSkill,
    getAdminOverview,
} from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/overview', getAdminOverview);
router.post('/modules', createModule);
router.post('/skills', createSkill);
router.post('/resources', createResource);

export default router;
