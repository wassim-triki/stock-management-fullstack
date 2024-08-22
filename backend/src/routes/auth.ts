import express from 'express';
import passport from 'passport';
const router = express.Router();

// Import controllers
import {
  signup,
  getAuthUserDetails,
  login,
  checkEmailAvailability,
  stepTwoHandler,
  handleChangePassword,
  logout, // Import the logout controller
} from '../controllers/auth';
import { authHandler } from '../middleware/authHandler';
import { SuccessResponse } from '../types/types';
import 'express-async-errors';
// Routes
router.get('/me', authHandler, getAuthUserDetails);
router.post('/signup', signup);
router.post('/login', login);
router.post('/check-email', authHandler, checkEmailAvailability);
router.post('/step-two', stepTwoHandler);
router.post('/change-password', authHandler, handleChangePassword);
router.get('/logout', authHandler, logout); // Add the logout route

// router.post('/forgotpassword', forgotPassword);
// router.post('/resetpassword/:resetToken', resetPassword);

export default router;
