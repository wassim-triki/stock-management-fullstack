import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import {
  ErrorResponse,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { paginateAndSearch } from '../utils/paginateAndSearch';
import { QueryParams } from './purchaseOrder';
import { Supplier } from '../models/Supplier';
import { Category } from '../models/Category';

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

    // if (supplier) {
    //   const supplierDocs = await Supplier.find({
    //     name: new RegExp(supplier as string, 'i'),
    //   });
    //   const supplierIds = supplierDocs.map((s) => s._id);
    //   query.supplier = { $in: supplierIds };
    // }

    // if (category) {
    //   const categoryDocs = await Category.find({
    //     name: new RegExp(category as string, 'i'),
    //   });
    //   const categoryIds = categoryDocs.map((c) => c._id);
    //   query.category = { $in: categoryIds };
    // }

    const products = await Product.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(offsetNum)
      .limit(limitNum)
      .populate('supplier', 'name')
      .populate('category', 'name');

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
    const product = await Product.create(req.body);
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
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  res.status(200).json(new SuccessResponse('Product updated', product));
};

// Delete a product by ID
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }
  res.status(200).json(new SuccessResponse('Product deleted', product));
};

// Get total number of products
export const getTotalProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const totalProducts = await Product.countDocuments();
  res.status(200).json(
    new SuccessResponse('Total products retrieved', {
      total: totalProducts,
    })
  );
};
