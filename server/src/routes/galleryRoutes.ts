import { Router } from 'express';
import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getGallery);
router.post('/', protectAdmin, createGalleryItem);
router.put('/:id', protectAdmin, updateGalleryItem);
router.delete('/:id', protectAdmin, deleteGalleryItem);

export default router;
