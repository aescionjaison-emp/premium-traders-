import { Router } from 'express';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getBanners);
router.post('/', protectAdmin, createBanner);
router.put('/:id', protectAdmin, updateBanner);
router.delete('/:id', protectAdmin, deleteBanner);

export default router;
