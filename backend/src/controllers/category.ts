// controllers/categoryController.ts
import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import {
  ErrorResponse,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';

// Get all categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 10, page = 1, search = '' } = req.query;

    const limitNum = Number(limit);
    const pageNum = Number(page);
    const skipNum = (pageNum - 1) * limitNum;

    const query = search
      ? {
          categoryName: { $regex: new RegExp(search as string, 'i') },
        }
      : {};

    const categories = await Category.find(query)
      .skip(skipNum)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json(
        new SuccessResponseList('Categories retrieved successfully', categories)
      );
  } catch (error: any) {
    next(new ErrorResponse('Failed to retrieve categories', 500));
  }
};

// Get a single category by ID
export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }
    res
      .status(200)
      .json(new SuccessResponse('Category retrieved successfully', category));
  } catch (error: any) {
    next(new ErrorResponse('Failed to retrieve category', 500));
  }
};

// Create a new category
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.create(req.body);
    res
      .status(201)
      .json(new SuccessResponse('Category created successfully', category));
  } catch (error: any) {
    next(new ErrorResponse(error, 500));
  }
};

// Update a category by ID
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }

    res
      .status(200)
      .json(new SuccessResponse('Category updated successfully', category));
  } catch (error: any) {
    next(new ErrorResponse(error, 500));
  }
};

// Delete a category by ID
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }
    res
      .status(200)
      .json(new SuccessResponse('Category deleted successfully', category));
  } catch (error: any) {
    next(new ErrorResponse(error, 500));
  }
};

// Get total number of categories
export const getTotalCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalCategories = await Category.countDocuments();
    res.status(200).json(
      new SuccessResponse('Total categories retrieved successfully', {
        total: totalCategories,
      })
    );
  } catch (error: any) {
    next(new ErrorResponse('Failed to retrieve total categories', 500));
  }
};
