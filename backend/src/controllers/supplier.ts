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
  try {
    throw new Error('Test error');
    const suppliers = await Supplier.find();
    res
      .status(200)
      .json(
        new SuccessResponseList('Suppliers retrieved successfully', suppliers)
      );
  } catch (error: any) {
    next(new ErrorResponse('Failed to retrieve suppliers', 500));
  }
};

// Get a single supplier by ID
export const getSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return next(new ErrorResponse('Supplier not found', 404));
    }
    res
      .status(200)
      .json(new SuccessResponse('Supplier retrieved successfully', supplier));
  } catch (error: any) {
    next(new ErrorResponse('Failed to retrieve supplier', 500));
  }
};

// Create a new supplier
export const createSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { companyName, contactName, contactEmail, phone, address } = req.body;
  try {
    const supplier = await Supplier.create({
      companyName,
      contactName,
      contactEmail,
      phone,
      address,
    });
    res
      .status(201)
      .json(new SuccessResponse('Supplier created successfully', supplier));
  } catch (error: any) {
    next(new ErrorResponse('Failed to create supplier', 500));
  }
};

// Update a supplier by ID
export const updateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!supplier) {
      return next(new ErrorResponse('Supplier not found', 404));
    }
    res
      .status(200)
      .json(new SuccessResponse('Supplier updated successfully', supplier));
  } catch (error: any) {
    next(new ErrorResponse('Failed to update supplier', 500));
  }
};

// Delete a supplier by ID
export const deleteSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return next(new ErrorResponse('Supplier not found', 404));
    }
    res
      .status(200)
      .json(new SuccessResponse('Supplier deleted successfully', {}));
  } catch (error: any) {
    next(new ErrorResponse('Failed to delete supplier', 500));
  }
};
