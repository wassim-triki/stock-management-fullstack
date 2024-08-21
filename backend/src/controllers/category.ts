// controllers/categoryController.ts
import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import {
  ErrorResponse,
  HttpCode,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { paginateAndSearch } from '../utils/paginateAndSearch';
import { QueryParams } from './purchaseOrder';
import { ROLES } from '../models/User';

export const getCategories = async (
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

  if (filters.name) query.name = new RegExp(filters.name as string, 'i');

  // Only allow Managers to see their own categories
  if (req.user?.role === ROLES.MANAGER) {
    query.user = req.user._id;
  }

  const categories = await Category.find(query)
    .sort({ [sortBy as string]: sortOrder })
    .skip(offsetNum)
    .limit(limitNum)
    .populate('parentCategory');

  res
    .status(200)
    .json(new SuccessResponseList('Categories retrieved', categories));
};

// Get a single category by ID
export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const category = await Category.findById(req.params.id).populate(
    'parentCategory'
  );

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  // Managers can only retrieve their own categories
  if (
    req.user?.role === ROLES.MANAGER &&
    category.user.toString() !== (req.user._id as string).toString()
  ) {
    return next(
      new ErrorResponse(
        'You are not authorized to access this category',
        HttpCode.UNAUTHORIZED
      )
    );
  }

  res.status(200).json(new SuccessResponse('Category retrieved', category));
};

// Create a new category

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
  });
  if (existingCategory) {
    return next(
      new ErrorResponse('Category with this name already exists', 400)
    );
  }

  const category = await Category.create({
    ...req.body,
    user: req.user?._id, // Assign the logged-in user as the creator
  });
  res.status(201).json(new SuccessResponse('Category created', category));
};

// Update a category by ID
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  // Managers can only update their own categories
  if (
    req.user?.role === ROLES.MANAGER &&
    category.user.toString() !== (req.user._id as string).toString()
  ) {
    return next(
      new ErrorResponse(
        'You are not authorized to update this category',
        HttpCode.UNAUTHORIZED
      )
    );
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res
    .status(200)
    .json(new SuccessResponse('Category updated', updatedCategory));
};

// Delete a category by ID
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }
  if (
    req.user?.role === ROLES.MANAGER &&
    category.user.toString() !== (req.user._id as string).toString()
  ) {
    return next(
      new ErrorResponse(
        'You are not authorized to access this resource',
        HttpCode.UNAUTHORIZED
      )
    );
  }
  await category.deleteOne();
  res.status(200).json(new SuccessResponse('Category deleted', category));
};

// Get total number of categories
export const getTotalCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const totalCategories = await Category.countDocuments(
    req.user?.role === ROLES.MANAGER ? { user: req.user?._id } : {}
  );
  res.status(200).json(
    new SuccessResponse('Total categories retrieved', {
      total: totalCategories,
    })
  );
};
