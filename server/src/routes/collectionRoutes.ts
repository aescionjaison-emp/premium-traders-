import { Router } from 'express';
import {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} from '../controllers/collectionController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getCollections);
router.get('/slug/:slug', getCollectionBySlug);

router.post('/', protectAdmin, createCollection);
router.put('/:id', protectAdmin, updateCollection);
router.delete('/:id', protectAdmin, deleteCollection);

export default router;
