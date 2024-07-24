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
    const { limit = 10, offset = 0, search = '' } = req.query;

    // Convert limit and offset to numbers
    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);

    // Build the query to be "like" search
    const query = search
      ? {
          companyName: { $regex: new RegExp(search as string, 'i') },
        }
      : {};

    const suppliers = await Supplier.find(query)
      .skip(offsetNum)
      .limit(limitNum);
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
export const getSupplierById = async (
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
  const { companyName, contactEmail, phone, address } = req.body;
  try {
    // Check if the email is already in use
    const existingSupplier = await Supplier.findOne({ contactEmail });
    if (existingSupplier) {
      return next(new ErrorResponse('Email is already in use', 400));
    }

    const supplier = await Supplier.create({
      companyName,
      contactEmail,
      phone,
      address,
    });
    res
      .status(201)
      .json(new SuccessResponse('Supplier created successfully', supplier));
  } catch (error: any) {
    next(new ErrorResponse(error, 500));
  }
};

// Update a supplier by ID
export const updateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { contactEmail } = req.body;

    // Check if the email is already in use by another supplier
    const existingSupplier = await Supplier.findOne({
      contactEmail,
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

    res
      .status(200)
      .json(new SuccessResponse('Supplier updated successfully', supplier));
  } catch (error: any) {
    next(new ErrorResponse(error, 500));
  }
};

// Delete a supplier by ID
export const deleteSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('🔵', req.params);
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return next(new ErrorResponse('Supplier not found', 404));
    }
    res
      .status(200)
      .json(new SuccessResponse('Supplier deleted successfully', supplier));
  } catch (error: any) {
    next(new ErrorResponse(error, 500));
  }
};

// Get total number of suppliers
export const getTotalSuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalSuppliers = await Supplier.countDocuments();
    res.status(200).json(
      new SuccessResponse('Total suppliers retrieved successfully', {
        total: totalSuppliers,
      })
    );
  } catch (error: any) {
    next(new ErrorResponse('Failed to retrieve total suppliers', 500));
  }
};
