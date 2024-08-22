import { NextFunction, Request, Response } from 'express';
import { Company } from '../models/Company';
import {
  SuccessResponse,
  SuccessResponseList,
  ErrorResponse,
  HttpCode,
} from '../types/types';
import { ROLES } from '../models/User';

// Get all companies with pagination, sorting, and filtering
export const getCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  const companies = await Company.find(query)
    .sort({ [sortBy as string]: sortOrder })
    .skip(offsetNum)
    .limit(limitNum)
    .populate('user', 'email');

  res
    .status(200)
    .json(new SuccessResponseList('Companies retrieved', companies));
};

// Get the total number of companies
export const getTotalCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const totalCompanies = await Company.countDocuments();
  res.status(200).json(
    new SuccessResponse('Total companies retrieved', {
      total: totalCompanies,
    })
  );
};

// Get a single company by ID
export const getCompanyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const company = await Company.findById(id).populate('user', 'email');
  if (!company) {
    return next(new ErrorResponse('Company not found', 404));
  }
  res.status(200).json(new SuccessResponse('Company retrieved', company));
};

// Create a new company (for managers, linking it to the user)
export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the user already has a company
  if (req.user?.company) {
    return next(new ErrorResponse('You already have a company', 400));
  }

  // Create the company
  const newCompany = await Company.create({
    ...req.body,
    user: req.user?._id, // Link the company to the user creating it
  });

  res.status(201).json(new SuccessResponse('Company created', newCompany));
};

// Update a company (owner or admin can update)
export const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const company = await Company.findById(id);

  if (!company) {
    return next(new ErrorResponse('Company not found', 404));
  }

  // Only allow the owner or an admin to update the company
  if (
    req.user?.role !== ROLES.ADMIN &&
    company.user.toString() !== (req.user?._id as string).toString()
  ) {
    return next(
      new ErrorResponse(
        'You are not authorized to update this company',
        HttpCode.UNAUTHORIZED
      )
    );
  }

  const updatedCompany = await Company.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new SuccessResponse('Company updated', updatedCompany));
};

// Delete a company (owner or admin can delete)
export const deleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const company = await Company.findById(id);

  if (!company) {
    return next(new ErrorResponse('Company not found', 404));
  }

  // Only allow the owner or an admin to delete the company
  if (
    req.user?.role !== ROLES.ADMIN &&
    company.user.toString() !== (req.user?._id as string).toString()
  ) {
    return next(
      new ErrorResponse(
        'You are not authorized to delete this company',
        HttpCode.UNAUTHORIZED
      )
    );
  }

  await company.deleteOne();
  res.status(200).json(new SuccessResponse('Company deleted', null));
};
