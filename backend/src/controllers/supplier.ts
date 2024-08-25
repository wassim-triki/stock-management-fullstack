import { Request, Response, NextFunction } from 'express';
import { Supplier } from '../models/Supplier';
import {
  ErrorResponse,
  HttpCode,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { ROLES } from '../models/User';

// Get all suppliers
export const getSuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
    if (filters.active) {
      const actives = (filters.active as string).split('.');
      query.active = { $in: actives };
    }
    // Managers can only retrieve their own suppliers
    if (req.user?.role === ROLES.MANAGER) query.user = req.user._id;

    const suppliers = await Supplier.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(offsetNum)
      .limit(limitNum)
      .populate('user', 'email');

    res
      .status(200)
      .json(new SuccessResponseList('Suppliers retrieved', suppliers));
  } catch (error) {
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

    // Managers can only access their own suppliers
    if (
      req.user?.role === ROLES.MANAGER &&
      supplier.user.toString() !== (req.user._id as string).toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to access this resource',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    res.status(200).json(new SuccessResponse('Supplier retrieved', supplier));
  } catch (error) {
    next(new ErrorResponse('Failed to retrieve supplier', 500));
  }
};

// Create a new supplier
export const createSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
      user: req.user?._id, // Associate the supplier with the manager creating it
    });

    res.status(201).json(new SuccessResponse('Supplier created', supplier));
  } catch (error) {
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
    const { email } = req.body;

    // Check if the email is already in use by another supplier
    const existingSupplier = await Supplier.findOne({
      email,
      _id: { $ne: req.params.id },
    });

    if (existingSupplier) {
      return next(new ErrorResponse('Email is already in use', 400));
    }

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return next(new ErrorResponse('Supplier not found', 404));
    }

    // Managers can only update their own suppliers
    if (
      req.user?.role === ROLES.MANAGER &&
      supplier.user.toString() !== (req.user._id as string).toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to update this resource',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res
      .status(200)
      .json(new SuccessResponse('Supplier updated', updatedSupplier));
  } catch (error) {
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
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return next(new ErrorResponse('Supplier not found', 404));
    }

    // Managers can only delete their own suppliers
    if (
      req.user?.role === ROLES.MANAGER &&
      supplier.user.toString() !== (req.user._id as string).toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to delete this resource',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    await supplier.deleteOne();

    res.status(200).json(new SuccessResponse('Supplier deleted', supplier));
  } catch (error) {
    next(new ErrorResponse('Failed to delete supplier', 500));
  }
};

// Get total number of suppliers
export const getTotalSuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query =
      req.user?.role === ROLES.MANAGER ? { user: req.user?._id } : {};
    const totalSuppliers = await Supplier.countDocuments(query);

    res.status(200).json(
      new SuccessResponse('Total suppliers retrieved', {
        total: totalSuppliers,
      })
    );
  } catch (error) {
    next(new ErrorResponse('Failed to retrieve total suppliers', 500));
  }
};
