// controllers/supplier.ts
import { Request, Response, NextFunction } from 'express';
import { Supplier } from '../models/Supplier';
import {
  ErrorResponse,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';

// Get all suppliers
export const getSuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    offset = 0,
    limit = 100,
    sortBy = 'createdAt',
    order = 'desc',
    ...filters
  } = req.query;

  const limitNum = parseInt(limit as string);
  const offsetNum = parseInt(offset as string);
  const sortOrder = order === 'desc' ? -1 : 1;

  const query: any = {};
  if (filters.name) query.name = new RegExp(filters.name as string, 'i');

  const suppliers = await Supplier.find(query)
    .sort({ [sortBy as string]: sortOrder })
    .skip(offsetNum)
    .limit(limitNum);

  res
    .status(200)
    .json(new SuccessResponseList('Suppliers retrieved', suppliers));
};

// Get a single supplier by ID
export const getSupplierById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    return next(new ErrorResponse('Supplier not found', 404));
  }
  res.status(200).json(new SuccessResponse('Supplier retrieved', supplier));
};

// Create a new supplier
export const createSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, phone, address } = req.body;
  // Check if the email is already in use
  const existingSupplier = await Supplier.findOne({ email });
  if (existingSupplier) {
    return next(new ErrorResponse('Email is already in use', 400));
  }

  const supplier = await Supplier.create({
    name,
    email,
    phone,
    address,
  });
  res.status(201).json(new SuccessResponse('Supplier created', supplier));
};

// Update a supplier by ID
export const updateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  // Check if the email is already in use by another supplier
  const existingSupplier = await Supplier.findOne({
    email,
    _id: { $ne: req.params.id },
  });

  if (existingSupplier) {
    return next(new ErrorResponse('Email is already in use', 400));
  }

  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!supplier) {
    return next(new ErrorResponse('Supplier not found', 404));
  }

  res.status(200).json(new SuccessResponse('Supplier updated', supplier));
};

// Delete a supplier by ID
export const deleteSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('🔵', req.params);
  const supplier = await Supplier.findByIdAndDelete(req.params.id);
  if (!supplier) {
    return next(new ErrorResponse('Supplier not found', 404));
  }
  res.status(200).json(new SuccessResponse('Supplier deleted', supplier));
};

// Get total number of suppliers
export const getTotalSuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const totalSuppliers = await Supplier.countDocuments();
  res.status(200).json(
    new SuccessResponse('Total suppliers retrieved', {
      total: totalSuppliers,
    })
  );
};
