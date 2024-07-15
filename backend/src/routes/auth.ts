import express from 'express';
const router = express.Router();
//import controllers
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/auth';

//routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resetToken').post(resetPassword);

export default router;
