import { Router } from 'express';
import {
  getHomepageConfig,
  updateHomepageConfig,
  reorderHomepageSections,
} from '../controllers/homepageController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getHomepageConfig);
router.put('/', protectAdmin, updateHomepageConfig);
router.post('/reorder', protectAdmin, reorderHomepageSections);

export default router;
