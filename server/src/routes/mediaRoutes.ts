import { Router } from 'express';
import { getMedia, createMedia, deleteMedia } from '../controllers/mediaController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getMedia);
router.post('/', protectAdmin, createMedia);
router.delete('/:id', protectAdmin, deleteMedia);

export default router;
