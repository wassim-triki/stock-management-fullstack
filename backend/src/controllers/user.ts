import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import mongoose from 'mongoose';
import {
  ErrorResponse,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';

export const getAllUsers = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    return res
      .status(200)
      .json(new SuccessResponseList('Users retrived successfully', users));
  } catch (error) {
    next(error);
  }
};

//get user by id
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid user ID', 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    res.json(user);
  } catch (error) {
    // Handle CastError specifically
    if (
      error instanceof mongoose.Error.CastError &&
      error.kind === 'ObjectId'
    ) {
      return next(new ErrorResponse('Invalid user ID format', 400));
    }
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid user ID', 400));
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    return res
      .status(200)
      .json(new SuccessResponse('User deleted successfully', user));
  } catch (error) {
    next(error);
  }
};
