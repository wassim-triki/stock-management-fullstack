import { Response, Request } from 'express';
import crypto from 'crypto';
import { IUser, User } from '../models/User';
import passport from '../config/passport';
import { ErrorResponse, SuccessResponse } from '../utils/response';
import { validateStepOne, validateStepTwo } from '../schemas/userSchemas';

export const signup = async (req: Request, res: Response, next: any) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phone,
    street,
    city,
    state,
    zip,
  } = req.body;
  const address = { street, city, state, zip };
  const profile = { firstName, lastName, phone, address };
  try {
    const userWithEmail = await User.findOne({ email });
    if (userWithEmail) {
      throw new ErrorResponse('Email is already in use', 400);
    }
    const user: IUser = await User.create({
      email,
      password,
      profile,
      address,
    });
    console.log('user created');
    return res.status(201).json(new SuccessResponse('Account created', user));
  } catch (error: any) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: any) => {
  passport.authenticate(
    'local',
    (err: Error, user: IUser, info: { message: string }) => {
      if (err) return next(err);
      if (!user) {
        return next(new ErrorResponse(info.message, 401));
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        User.findOne({ email: user.email }).then((user) => {
          return res
            .status(200)
            .json(new SuccessResponse('Login successful', user));
        });
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
  try {
    if (!valid) {
      throw new ErrorResponse('Validation failed', 400, validateStepOne.errors);
    }

    const user = await User.findOne({ email });
    if (user) {
      throw new ErrorResponse('Email is already in use', 400);
    }
    return res.status(200).json(new SuccessResponse('Email is available', {}));
  } catch (error: any) {
    next(error);
  }
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
      throw new ErrorResponse('Validation failed', 400, validateStepOne.errors);
    }

    return res
      .status(200)
      .json(new SuccessResponse('Step 2 completed successfully', {}));
  } catch (error: any) {
    next(error);
  }
};
