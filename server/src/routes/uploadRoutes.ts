import { Router } from 'express';
import { uploadSingleImage, uploadMultipleImages } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/single', protectAdmin, upload.single('image'), uploadSingleImage);
router.post('/multiple', protectAdmin, upload.array('images', 10), uploadMultipleImages);

export default router;
