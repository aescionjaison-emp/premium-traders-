import { Router } from 'express';
import { getNavigation, updateNavigation } from '../controllers/navigationController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getNavigation);
router.put('/', protectAdmin, updateNavigation);

export default router;
