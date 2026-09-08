import { Router } from 'express';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brandController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getBrands);
router.post('/', protectAdmin, createBrand);
router.put('/:id', protectAdmin, updateBrand);
router.delete('/:id', protectAdmin, deleteBrand);

export default router;
