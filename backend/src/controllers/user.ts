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

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('👍👍👍👍👍👍', req.params);
    const user = await User.findById(req.params.id);
    console.log('🤞🤞🤞🤞🤞🤞🤞', user?._id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    res
      .status(200)
      .json(new SuccessResponse('User retrieved successfully', user));
  } catch (error: any) {
    next(new ErrorResponse('Failed to retrieve user', 500));
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
