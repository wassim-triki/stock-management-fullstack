// controllers/supplier.ts
import { Request, Response, NextFunction } from 'express';
import { Supplier } from '../models/Supplier';
import {
  ErrorResponse,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { paginateAndSearch } from '../utils/paginateAndSearch';
import { QueryParams } from './purchaseOrder';

// Get all suppliers
export const getSuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      limit = 100,
      offset = 0,
      name,
      email,
      phone,
      sort = 'updatedAt_desc',
    } = req.query as QueryParams;

    const limitNum = Number(limit);
    const offsetNum = Number(offset);

    let s = sort.split('_');
    let x = { [s[0]]: s[1] } as any;
    const search: any = {};
    name && (search.name = { $regex: new RegExp(name, 'i') });
    email && (search.email = { $regex: new RegExp(email, 'i') });
    phone && (search.phone = { $regex: new RegExp(phone, 'i') });

    const suppliers = await Supplier.find(search)
      .skip(offsetNum)
      .limit(limitNum)
      .sort(x);

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
  const { name, email, phone, address } = req.body;
  try {
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
