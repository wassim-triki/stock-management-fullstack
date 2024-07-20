import express from 'express';
import passport from 'passport';
const router = express.Router();
// Import controllers
import {
  signup,
  // forgotPassword,
  // resetPassword,
  login,
  checkEmailAvailability,
  stepTwoHandler,
} from '../controllers/auth';
import { authHandler } from '../middleware/authHandler';
import { SuccessResponse } from '../utils/response';

// Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/check-email', checkEmailAvailability);
router.post('/step-two', stepTwoHandler);
router.get('/check-session', authHandler, (req, res) =>
  res.status(200).json(new SuccessResponse('Authorized', req.user))
);
// router.post('/forgotpassword', forgotPassword);
// router.post('/resetpassword/:resetToken', resetPassword);

export default router;
