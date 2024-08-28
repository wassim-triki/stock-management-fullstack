import { Response, Request, CookieOptions, NextFunction } from 'express';
import crypto from 'crypto';
import passport from '../config/passport';

import {
  ErrorResponse,
  HttpCode,
  IUser,
  SuccessResponse,
} from '../types/types';
import { User } from '../models/User';
import { Company } from '../models/Company';
import mailer from '../services/mailer';
import config from '../config/config';
const currencies = require('../utils/currencies.json');

export const signup = async (req: Request, res: Response, next: any) => {
  const { email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(new ErrorResponse('Passwords do not match', 400));
  }
  const userWithEmail = await User.findOne({ email });
  if (userWithEmail) {
    return next(new ErrorResponse('Email is already in use', 400));
  }
  const user: IUser = await User.create({
    email,
    password,
  });
  return res.status(201).json(new SuccessResponse('Account created', user));
};

export const login = async (req: Request, res: Response, next: any) => {
  passport.authenticate(
    'local',
    (err: Error, user: any, info: { message: string }) => {
      if (err) return next(err);
      if (!user) {
        throw new ErrorResponse(info.message, 401);
      }
      req.logIn(user, (err) => {
        if (err) return next(err);

        logging.warning(
          '🍪 cookie from login controller:',
          'session',
          req.cookies.session
        );

        return res
          .status(200)
          .json(new SuccessResponse('Login successful', user));
      });
    }
  )(req, res, next);
};

export const checkEmailAvailability = async (
  req: Request,
  res: Response,
  next: any
) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  const company = await Company.findOne({ email });
  if (user || company) {
    throw new ErrorResponse('Email is already in use', 400);
  }
  next();
};

export const changeEmail = async (req: Request, res: Response, next: any) => {
  const { email } = req.body;
  const user = await User.findById(req.user?.id);
  if (!user) return next(new ErrorResponse('User not found', 404));
  user.email = email;
  const newUser = await user.save();
  return res
    .status(200)
    .json(new SuccessResponse('Email updated', { email: newUser.email }));
};

export const handleChangeInfo = async (
  req: Request,
  res: Response,
  next: any
) => {
  const { profile } = req.body;
  const user = await User.findById(req.user?.id);
  if (!user) return next(new ErrorResponse('User not found', 404));
  const userCurrency = currencies[profile.currency];
  if (!userCurrency) {
    throw new ErrorResponse('Invalid currency', 400);
  }
  profile.currency = userCurrency;

  user.profile = profile;
  const newUser = await user.save();
  return res
    .status(200)
    .json(new SuccessResponse('Profile updated', { profile: newUser.profile }));
};

export const getAuthUserDetails = async (
  req: Request,
  res: Response,
  next: any
) => {
  return res.status(200).json(new SuccessResponse('Authorized', req.user));
};

export const logout = async (req: Request, res: Response, next: any) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.status(200).json(new SuccessResponse('Logout successful'));
  });
};

export const handleChangePassword = async (
  req: Request,
  res: Response,
  next: any
) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) {
    return next(new ErrorResponse('Passwords do not match', 400));
  }
  const user = await User.findById(req.user?.id).select('+password');
  if (!user) return next(new ErrorResponse('User not found', 404));
  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Incorrect old password', 400));
  }
  user.password = newPassword;
  await user.save();
  return res.status(200).json(new SuccessResponse('Password updated'));
};

// Controller to handle forgot password
export const sendPasswordResetEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new ErrorResponse('No user found with that email', HttpCode.NOT_FOUND)
      );
    }

    // Generate a password reset token and set expiration
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = (Date.now() + 60 * 60 * 1000).toString(); // 1 hour expiry

    await user.save();

    // Create reset URL
    const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;

    // Email content
    const message = `
      <h1>Password Reset Request</h1>
      <p>Please click on the following link to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link is valid for 1 hour.</p>
    `;

    // Send email
    await mailer.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: message,
    });

    res.status(200).json(new SuccessResponse('Email sent', {}));
  } catch (error) {
    return next(
      new ErrorResponse(
        'Failed to send password reset email',
        HttpCode.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// Controller to handle reset password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params; // Token is passed in the URL as a parameter
  const { password } = req.body;

  try {
    // Hash the token and compare with the one in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user by token and check if token is still valid (not expired)
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Ensure token has not expired
    });

    if (!user) {
      return next(
        new ErrorResponse(
          'Invalid or expired password reset token',
          HttpCode.BAD_REQUEST
        )
      );
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json(new SuccessResponse('Password reset successful', {}));
  } catch (error) {
    return next(
      new ErrorResponse(
        'Failed to reset password',
        HttpCode.INTERNAL_SERVER_ERROR
      )
    );
  }
};
