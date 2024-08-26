import { NextFunction, Request, Response } from 'express';
import { PaymentStatus, InvoiceType, Invoice } from '../models/Invoice';
import {
  ErrorResponse,
  HttpCode,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { ROLES } from '../models/User';

// Fetch all invoices
export const getInvoices = async (
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
    if (filters.paymentStatus) {
      const statuses = (filters.paymentStatus as string).split('.');
      query.paymentStatus = { $in: statuses };
    }
    if (filters.invoiceType) {
      const types = (filters.invoiceType as string).split('.');
      query.invoiceType = { $in: types };
    }
    if (req.user?.role === ROLES.MANAGER) {
      query.user = req.user._id;
    }

    const invoices = await Invoice.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(offsetNum)
      .limit(limitNum)
      .populate('purchaseOrder', 'orderNumber')
      .populate('user', 'email')
      .populate('client', 'name')
      .populate('supplier', 'name');

    res
      .status(200)
      .json(new SuccessResponseList('Invoices retrieved', invoices));
  } catch (error) {
    next(new ErrorResponse('Failed to retrieve invoices', 500));
  }
};

// Create a new invoice
export const createInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    totalAmount,
    paidAmount,
    dueDate,
    invoiceType,
    entityId,
    purchaseOrder,
  } = req.body;

  if (invoiceType === InvoiceType.Supplier && !entityId) {
    return next(
      new ErrorResponse('Supplier is required for supplier invoices', 400)
    );
  }
  if (invoiceType === InvoiceType.Client && !entityId) {
    return next(
      new ErrorResponse('Client is required for client invoices', 400)
    );
  }
  if (!purchaseOrder) delete req.body.purchaseOrder;

  let status: PaymentStatus =
    Number(paidAmount) >= Number(totalAmount)
      ? PaymentStatus.PAID
      : Number(paidAmount) > 0 && Number(paidAmount) < Number(totalAmount)
      ? PaymentStatus.PARTIALLY_PAID
      : PaymentStatus.UNPAID;

  if (new Date(dueDate) < new Date() && status !== PaymentStatus.PAID) {
    status = PaymentStatus.OVERDUE;
  }

  req.body.paymentDate = status === PaymentStatus.PAID ? new Date() : null;

  const newInvoiceData = {
    ...req.body,
    paymentStatus: status,
    user: req.user?._id,
    [invoiceType === InvoiceType.Supplier ? 'supplier' : 'client']: entityId,
  };

  const newInvoice = await Invoice.create(newInvoiceData);

  res.status(201).json(new SuccessResponse('Invoice created', newInvoice));
};

// Update an invoice by ID
export const updateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { totalAmount, paidAmount, dueDate, invoiceType, entityId } =
      req.body;

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return next(new ErrorResponse('Invoice not found', 404));
    }

    if (
      req.user?.role === ROLES.MANAGER &&
      invoice.user.toString() !== req.user._id?.toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to update this invoice',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    let status: PaymentStatus =
      Number(paidAmount) >= Number(totalAmount)
        ? PaymentStatus.PAID
        : Number(paidAmount) > 0 && Number(paidAmount) < Number(totalAmount)
        ? PaymentStatus.PARTIALLY_PAID
        : PaymentStatus.UNPAID;

    if (new Date(dueDate) < new Date() && status !== PaymentStatus.PAID) {
      status = PaymentStatus.OVERDUE;
    }

    req.body.paymentDate = status === PaymentStatus.PAID ? new Date() : null;

    const updatedInvoiceData = {
      ...req.body,
      paymentStatus: status,
      [invoiceType === InvoiceType.Supplier ? 'supplier' : 'client']: entityId,
    };

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      updatedInvoiceData,
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .json(new SuccessResponse('Invoice updated', updatedInvoice));
  } catch (error) {
    next(new ErrorResponse('Failed to update invoice', 500));
  }
};

// Fetch a single invoice by ID
export const getInvoiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id)
      .populate('purchaseOrder', 'orderNumber')
      .populate('client', 'name')
      .populate('supplier', 'name');

    if (!invoice) {
      return next(new ErrorResponse('Invoice not found', 404));
    }

    if (
      req.user?.role === ROLES.MANAGER &&
      invoice.user.toString() !== req.user._id?.toString()
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

// Delete an invoice
export const deleteInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return next(new ErrorResponse('Invoice not found', 404));
    }

    if (
      req.user?.role === ROLES.MANAGER &&
      invoice.user.toString() !== req.user._id?.toString()
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

// Get total number of invoices
export const getTotalInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query =
      req.user?.role === ROLES.MANAGER ? { user: req.user._id } : {};
    const total = await Invoice.countDocuments(query);

    res
      .status(200)
      .json(new SuccessResponse('Total invoices retrieved', { total }));
  } catch (error) {
    next(new ErrorResponse('Failed to retrieve total invoices', 500));
  }
};
