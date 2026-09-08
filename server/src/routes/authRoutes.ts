import { Router } from 'express';
import { loginAdmin, getAdminProfile, updateAdminProfile } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', authLimiter, loginAdmin);
router.get('/profile', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, updateAdminProfile);

export default router;
