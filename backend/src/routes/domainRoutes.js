import express from 'express';
const router = express.Router();
import { getDomains, createDomain, deleteDomain } from '../controllers/domainController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

router.get('/', getDomains);
router.post('/', protect, adminOnly, createDomain);
router.delete('/:domainId', protect, adminOnly, deleteDomain);

export default router;
