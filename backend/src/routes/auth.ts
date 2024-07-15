import express from 'express';
import passport from 'passport';
const router = express.Router();
// Import controllers
import {
  register,
  forgotPassword,
  resetPassword,
  login,
} from '../controllers/auth';

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:resetToken', resetPassword);

export default router;
