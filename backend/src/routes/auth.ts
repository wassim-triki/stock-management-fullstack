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
  logout, // Import the logout controller
} from '../controllers/auth';
import { authHandler } from '../middleware/authHandler';
import { SuccessResponse } from '../types/types';

// Routes
router.get('/me', authHandler, getAuthUserDetails);
router.post('/signup', signup);
router.post('/login', login);
router.post('/check-email', authHandler, checkEmailAvailability);
router.post('/step-two', stepTwoHandler);
router.get('/check-session', authHandler, (req, res) =>
  res.status(200).json(new SuccessResponse('Authorized'))
);
router.post('/logout', authHandler, logout); // Add the logout route

// router.post('/forgotpassword', forgotPassword);
// router.post('/resetpassword/:resetToken', resetPassword);

export default router;
