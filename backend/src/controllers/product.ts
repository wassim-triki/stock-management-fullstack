import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import {
  ErrorResponse,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { paginateAndSearch } from '../utils/paginateAndSearch';
import { QueryParams } from './purchaseOrder';

// Get all products
export const getProducts = async (
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

    const products = await Product.find(search)
      .skip(offsetNum)
      .limit(limitNum)
      .sort(x)
      .populate('category')
      .populate('supplier');

    res
      .status(200)
      .json(
        new SuccessResponseList('Products retrieved successfully', products)
      );
  } catch (error: any) {
    next(new ErrorResponse('Failed to retrieve products', 500));
  }
};

// Get a single product by ID
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category supplier'
    );
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }
    res
      .status(200)
      .json(new SuccessResponse('Product retrieved successfully', product));
  } catch (error: any) {
    next(new ErrorResponse('Failed to retrieve product', 500));
  }
};

// Create a new product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.create(req.body);
    res
      .status(201)
      .json(new SuccessResponse('Product created successfully', product));
  } catch (error: any) {
    next(new ErrorResponse(error, 500));
  }
};

// Update a product by ID
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    res
      .status(200)
      .json(new SuccessResponse('Product updated successfully', product));
  } catch (error: any) {
    next(new ErrorResponse(error, 500));
  }
};

// Delete a product by ID
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }
    res
      .status(200)
      .json(new SuccessResponse('Product deleted successfully', product));
  } catch (error: any) {
    next(new ErrorResponse(error, 500));
  }
};

// Get total number of products
export const getTotalProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.status(200).json(
      new SuccessResponse('Total products retrieved successfully', {
        total: totalProducts,
      })
    );
  } catch (error: any) {
    next(new ErrorResponse('Failed to retrieve total products', 500));
  }
};
