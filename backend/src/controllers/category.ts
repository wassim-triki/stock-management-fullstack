// controllers/categoryController.ts
import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import {
  ErrorResponse,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { paginateAndSearch } from '../utils/paginateAndSearch';

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      limit = 10,
      page = 1,
      search = '',
      sort = { createdAt: -1 },
      noFilters = false,
    } = req.query;

    let categories;
    if (noFilters) {
      categories = await Category.find()
        .sort(sort as any)
        .populate('parentCategory');
    } else {
      const { items } = await paginateAndSearch(
        Category,
        'name',
        search as string,
        Number(limit),
        Number(page),
        sort as any
      );
      categories = await Category.populate(items, 'parentCategory');
    }

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
    // const { name } = req.body;
    // const existingCategory = await Category.findOne({
    //   name: { $regex: new RegExp(`^${name}$`, 'i') },
    // });
    // if (existingCategory) {
    //   return next(
    //     new ErrorResponse('Category with this name already exists', 400)
    //   );
    // }

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
