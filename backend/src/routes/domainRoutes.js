import express from 'express';
const router = express.Router();
import { getDomains, createDomain } from '../controllers/domainController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

router.get('/', getDomains);
router.post('/', protect, adminOnly, createDomain);

export default router;
