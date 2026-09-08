import { Router } from 'express';
import { getSiteSettings, updateSiteSettings } from '../controllers/settingsController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getSiteSettings);
router.put('/', protectAdmin, updateSiteSettings);

export default router;
