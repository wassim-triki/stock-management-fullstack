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
  try {
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

    const users = await User.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(offsetNum)
      .limit(limitNum);
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

export const createUser = async (req: Request, res: Response, next: any) => {
  const { email, password, profile, address, role, active } = req.body;
  try {
    const userWithEmail = await User.findOne({ email });
    if (userWithEmail) {
      throw new ErrorResponse('Email is already in use', 400);
    }
    const user: IUser = await User.create({
      email,
      profile,
      address,
      password,
      role,
      active,
    });
    console.log('user created');
    return res.status(201).json(new SuccessResponse('Account created', user));
  } catch (error: any) {
    next(error);
  }
};

export const getTotalUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json(
      new SuccessResponse('Total users retrieved successfully', {
        total: totalUsers,
      })
    );
  } catch (error: any) {
    next(new ErrorResponse('Failed to retrieve total users', 500));
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res
      .status(200)
      .json(new SuccessResponse('User updated successfully', user));
  } catch (error: any) {
    next(new ErrorResponse(error, 500));
  }
};
