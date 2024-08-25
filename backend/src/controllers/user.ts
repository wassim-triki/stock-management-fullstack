import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import mongoose from 'mongoose';
import {
  ErrorResponse,
  IUser,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { paginateAndSearch } from '../utils/paginateAndSearch';
import { QueryParams } from './purchaseOrder';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    offset = 0,
    limit = 100,
    sortBy = 'updatedAt',
    order = 'desc',
    ...filters
  } = req.query;

  const limitNum = parseInt(limit as string);
  const offsetNum = parseInt(offset as string);
  const sortOrder = order === 'desc' ? -1 : 1;

  const query: any = {};
  if (filters.email) query.email = new RegExp(filters.email as string, 'i');
  if (filters.active) {
    const actives = (filters.active as string).split('.');
    query.active = { $in: actives };
  }
  if (filters.role) {
    const roles = (filters.role as string).split('.');
    query.role = { $in: roles };
  }
  const users = await User.find(query)
    .sort({ [sortBy as string]: sortOrder })
    .skip(offsetNum)
    .limit(limitNum);
  return res.status(200).json(new SuccessResponseList('Users retrived', users));
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('👍👍👍👍👍👍', req.params);
  const user = await User.findById(req.params.id);
  console.log('🤞🤞🤞🤞🤞🤞🤞', user?._id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  res.status(200).json(new SuccessResponse('User retrieved', user));
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorResponse('Invalid user ID', 400));
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  return res.status(200).json(new SuccessResponse('User deleted', user));
};

export const getTotalUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const totalUsers = await User.countDocuments();
  res.status(200).json(
    new SuccessResponse('Total users retrieved', {
      total: totalUsers,
    })
  );
};

export const createUser = async (req: Request, res: Response, next: any) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new ErrorResponse('Passwords do not match', 400));
  }
  const userWithEmail = await User.findOne({ email });
  if (userWithEmail) {
    throw new ErrorResponse('Email is already in use', 400);
  }
  const user: IUser = await User.create({
    ...req.body,
    password,
    email,
  });
  return res.status(201).json(new SuccessResponse('Account created', user));
};
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  const { password, confirmPassword } = data;
  if (!password && !confirmPassword) {
    delete data.password;
  }
  if (data.password && password !== confirmPassword) {
    return next(new ErrorResponse('Passwords do not match', 400));
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Update user fields manually
  user.set(data);

  // If password is being updated, Mongoose pre('save') will hash it
  const updatedUser = await user.save({});

  res.status(200).json(new SuccessResponse('User updated', updatedUser));
};
