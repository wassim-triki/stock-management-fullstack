// controllers/categoryController.ts
import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import {
  ErrorResponse,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { paginateAndSearch } from '../utils/paginateAndSearch';
import { QueryParams } from './purchaseOrder';

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      limit = 100,
      offset = 0,
      name,
      sort = 'updatedAt_desc',
    } = req.query as QueryParams;

    const limitNum = Number(limit);
    const offsetNum = Number(offset);

    let s = sort.split('_');
    let x = { [s[0]]: s[1] } as any;
    const search: any = {};
    name && (search.name = { $regex: new RegExp(name, 'i') });

    const categories = await Category.find(search)
      .skip(offsetNum)
      .limit(limitNum)
      .sort(x)
      .populate('parentCategory');

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
    const category = await Category.findById(req.params.id).populate(
      'parentCategory'
    );
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
    const { name } = req.body;
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });
    if (existingCategory) {
      return next(
        new ErrorResponse('Category with this name already exists', 400)
      );
    }

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
