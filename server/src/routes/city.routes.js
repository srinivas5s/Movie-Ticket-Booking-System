import { Router } from 'express';
import {
  getCities,
  detectCity,
  createCity,
  updateCity,
  deleteCity,
} from '../controllers/cityController.js';
import {
  createCitySchema,
  updateCitySchema,
} from '../utils/validators/cityValidator.js';
import { validateRequest } from '../utils/validators/authValidator.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getCities);
router.get('/detect', detectCity);

// Admin-only management routes
router.post('/', protect, authorize('ADMIN'), validateRequest(createCitySchema), createCity);
router.put('/:id', protect, authorize('ADMIN'), validateRequest(updateCitySchema), updateCity);
router.delete('/:id', protect, authorize('ADMIN'), deleteCity);

export default router;
