import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  validateRequest,
} from '../utils/validators/authValidator.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, validateRequest(updateProfileSchema), updateProfile);

export default router;
