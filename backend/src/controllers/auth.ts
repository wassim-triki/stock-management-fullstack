import { Response, Request, CookieOptions } from 'express';
import crypto from 'crypto';
import passport from '../config/passport';
import { validateStepOne, validateStepTwo } from '../schemas/userSchemas';
import { ErrorResponse, IUser, SuccessResponse } from '../types/types';
import { User } from '../models/User';

export const signup = async (req: Request, res: Response, next: any) => {
  const { email, password, firstName, lastName, phone, address } = req.body;
  const profile = { firstName, lastName, phone, address };
  const userWithEmail = await User.findOne({ email });
  if (userWithEmail) {
    return next(new ErrorResponse('Email is already in use', 400));
  }
  const user: IUser = await User.create({
    email,
    password,
    profile,
    address,
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

  const valid = validateStepOne(req.body);
  if (!valid) {
    throw new ErrorResponse('Validation failed', 400);
  }

  const user = await User.findOne({ email });
  if (user) {
    throw new ErrorResponse('Email is already in use', 400);
  }
  return res.status(200).json(new SuccessResponse('Email is available'));
};

export const stepTwoHandler = async (
  req: Request,
  res: Response,
  next: any
) => {
  const { firstName, lastName } = req.body;

  const valid = validateStepTwo(req.body);
  try {
    if (!valid) {
      throw new ErrorResponse('Validation failed', 400);
    }

    return res.status(200).json(new SuccessResponse('Step 2 completed'));
  } catch (error: any) {
    next(error);
  }
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
