import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  getFilterOptions,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductFeature,
  toggleProductVisibility,
  duplicateProduct,
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/filters', getFilterOptions);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);

// Admin protected routes
router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);
router.patch('/:id/toggle-feature', protectAdmin, toggleProductFeature);
router.patch('/:id/toggle-visibility', protectAdmin, toggleProductVisibility);
router.post('/:id/duplicate', protectAdmin, duplicateProduct);

export default router;
