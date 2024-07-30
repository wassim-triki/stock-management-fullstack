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
      limit = 100,
      offset = 0,
      email,
      sort = 'updatedAt_desc',
    } = req.query as QueryParams;

    const limitNum = Number(limit);
    const offsetNum = Number(offset);

    let s = sort.split('_');
    let x = { [s[0]]: s[1] } as any;
    const search: any = {};
    email && (search.email = { $regex: new RegExp(email, 'i') });

    const users = await User.find(search)
      .skip(offsetNum)
      .limit(limitNum)
      .sort(x);
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
