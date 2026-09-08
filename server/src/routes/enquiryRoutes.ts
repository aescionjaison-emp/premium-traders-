import { Router } from 'express';
import {
  submitEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { protectAdmin } from '../middleware/auth.js';
import { enquiryLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public customer enquiry submission
router.post('/', enquiryLimiter, submitEnquiry);

// Admin enquiry management
router.get('/', protectAdmin, getEnquiries);
router.patch('/:id/status', protectAdmin, updateEnquiryStatus);
router.delete('/:id', protectAdmin, deleteEnquiry);

export default router;
