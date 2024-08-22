import { NextFunction, Request, Response } from 'express';
import { PaymentStatus, SupplierInvoice } from '../models/SupplierInvoice';
import {
  ErrorResponse,
  HttpCode,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { ROLES } from '../models/User';

export const getSupplierInvoices = async (
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
    if (filters.invoiceNumber)
      query.invoiceNumber = new RegExp(filters.invoiceNumber as string, 'i');

    // Managers can only retrieve their own invoices
    if (req.user?.role === ROLES.MANAGER) {
      query.user = req.user._id;
    }

    const invoices = await SupplierInvoice.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(offsetNum)
      .limit(limitNum)
      .populate('purchaseOrder', 'orderNumber')
      .populate('user', 'email');

    res
      .status(200)
      .json(new SuccessResponseList('Invoices retrieved', invoices));
  } catch (error) {
    next(new ErrorResponse('Failed to retrieve invoices', 500));
  }
};

export const createSupplierInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { totalAmount, paidAmount, dueDate } = req.body;
    let status: PaymentStatus;

    status =
      Number(paidAmount) >= Number(totalAmount)
        ? PaymentStatus.PAID
        : Number(paidAmount) > 0 && Number(paidAmount) < Number(totalAmount)
        ? PaymentStatus.PARTIALLY_PAID
        : PaymentStatus.UNPAID;

    if (new Date(dueDate) < new Date() && status !== PaymentStatus.PAID) {
      status = PaymentStatus.OVERDUE;
    }

    req.body.paymentDate = status === PaymentStatus.PAID ? new Date() : null;

    const newInvoice = await SupplierInvoice.create({
      ...req.body,
      paymentStatus: status,
      user: req.user?._id, // Associate the invoice with the manager creating it
    });

    res.status(201).json(new SuccessResponse('Invoice created', newInvoice));
  } catch (error) {
    next(new ErrorResponse('Failed to create invoice', 500));
  }
};

export const updateSupplierInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { totalAmount, paidAmount, dueDate } = req.body;

    const invoice = await SupplierInvoice.findById(id);
    if (!invoice) {
      return next(new ErrorResponse('Invoice not found', 404));
    }

    // Managers can only update their own invoices
    if (
      req.user?.role === ROLES.MANAGER &&
      invoice.user.toString() !== (req.user._id as string).toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to update this invoice',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    let status: PaymentStatus;
    status =
      Number(paidAmount) >= Number(totalAmount)
        ? PaymentStatus.PAID
        : Number(paidAmount) > 0 && Number(paidAmount) < Number(totalAmount)
        ? PaymentStatus.PARTIALLY_PAID
        : PaymentStatus.UNPAID;

    if (new Date(dueDate) < new Date() && status !== PaymentStatus.PAID) {
      status = PaymentStatus.OVERDUE;
    }

    req.body.paymentDate = status === PaymentStatus.PAID ? new Date() : null;

    const updatedInvoice = await SupplierInvoice.findByIdAndUpdate(
      id,
      { ...req.body, paymentStatus: status },
      { new: true }
    );

    res
      .status(200)
      .json(new SuccessResponse('Invoice updated', updatedInvoice));
  } catch (error) {
    next(new ErrorResponse('Failed to update invoice', 500));
  }
};

export const getSupplierInvoiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const invoice = await SupplierInvoice.findById(id).populate(
      'purchaseOrder',
      'orderNumber'
    );

    if (!invoice) {
      return next(new ErrorResponse('Invoice not found', 404));
    }

    // Managers can only access their own invoices
    if (
      req.user?.role === ROLES.MANAGER &&
      invoice.user.toString() !== (req.user._id as string).toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to access this invoice',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    res.status(200).json(new SuccessResponse('Invoice retrieved', invoice));
  } catch (error) {
    next(new ErrorResponse('Failed to retrieve invoice', 500));
  }
};

export const deleteSupplierInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const invoice = await SupplierInvoice.findById(id);

    if (!invoice) {
      return next(new ErrorResponse('Invoice not found', 404));
    }

    // Managers can only delete their own invoices
    if (
      req.user?.role === ROLES.MANAGER &&
      invoice.user.toString() !== (req.user._id as string).toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to delete this invoice',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    await invoice.deleteOne();
    res.status(200).json(new SuccessResponse('Invoice deleted', null));
  } catch (error) {
    next(new ErrorResponse('Failed to delete invoice', 500));
  }
};

export const getTotalSupplierInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query =
      req.user?.role === ROLES.MANAGER ? { user: req.user._id } : {};
    const total = await SupplierInvoice.countDocuments(query);

    res
      .status(200)
      .json(new SuccessResponse('Total invoices retrieved', { total }));
  } catch (error) {
    next(new ErrorResponse('Failed to retrieve total invoices', 500));
  }
};
