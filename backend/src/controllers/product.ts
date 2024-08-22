import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import {
  ErrorResponse,
  HttpCode,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { paginateAndSearch } from '../utils/paginateAndSearch';
import { QueryParams } from './purchaseOrder';
import { Supplier } from '../models/Supplier';
import { Category } from '../models/Category';
import { ROLES } from '../models/User';

// Get all products
export const getProducts = async (
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

    if (filters.name) query.name = new RegExp(filters.name as string, 'i');
    if (filters.minPrice)
      query.price = {
        ...query.price,
        $gte: parseFloat(filters.minPrice as string),
      };
    if (filters.maxPrice)
      query.price = {
        ...query.price,
        $lte: parseFloat(filters.maxPrice as string),
      };
    if (filters.minQuantity)
      query.quantityInStock = {
        ...query.quantityInStock,
        $gte: parseInt(filters.minQuantity as string),
      };
    if (filters.maxQuantity)
      query.quantityInStock = {
        ...query.quantityInStock,
        $lte: parseInt(filters.maxQuantity as string),
      };

    // Ensure that Managers can only see their own products
    if (req.user?.role === ROLES.MANAGER) {
      query.user = req.user._id; // Limit products to the manager's own products
    }

    const products = await Product.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(offsetNum)
      .limit(limitNum)
      .populate('supplier', 'name')
      .populate('category', 'name')
      .populate('user', ['email', 'role']);

    res
      .status(200)
      .json(new SuccessResponseList('Products retrieved', products));
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

    // Managers can only access their own products
    if (
      req.user?.role === ROLES.MANAGER &&
      product.user.toString() !== (req.user._id as string).toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to access this product',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    res.status(200).json(new SuccessResponse('Product retrieved', product));
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
    const product = await Product.create({
      ...req.body,
      user: req.user?._id, // Associate the product with the manager creating it
    });
    res.status(201).json(new SuccessResponse('Product created', product));
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
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Managers can only update their own products
  if (
    req.user?.role === ROLES.MANAGER &&
    product.user.toString() !== (req.user._id as string).toString()
  ) {
    return next(
      new ErrorResponse(
        'You are not authorized to update this product',
        HttpCode.UNAUTHORIZED
      )
    );
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(new SuccessResponse('Product updated', updatedProduct));
};

// Delete a product by ID
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Managers can only delete their own products
  if (
    req.user?.role === ROLES.MANAGER &&
    product.user.toString() !== (req.user._id as string).toString()
  ) {
    return next(
      new ErrorResponse(
        'You are not authorized to delete this product',
        HttpCode.UNAUTHORIZED
      )
    );
  }

  await product.deleteOne();

  res.status(200).json(new SuccessResponse('Product deleted', product));
};

// Get total number of products
export const getTotalProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.user?.role === ROLES.MANAGER ? { user: req.user._id } : {};

  const totalProducts = await Product.countDocuments(query);
  res.status(200).json(
    new SuccessResponse('Total products retrieved', {
      total: totalProducts,
    })
  );
};
