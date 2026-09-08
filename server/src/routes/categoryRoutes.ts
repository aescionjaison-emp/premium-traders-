import { Router } from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);

router.post('/', protectAdmin, createCategory);
router.put('/:id', protectAdmin, updateCategory);
router.delete('/:id', protectAdmin, deleteCategory);

export default router;
