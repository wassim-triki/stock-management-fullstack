import { NextFunction, Request, Response } from 'express';
import { PaymentStatus, SupplierInvoice } from '../models/SupplierInvoice';
import {
  ErrorResponse,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';

export const getSupplierInvoices = async (
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
  if (filters.invoiceNumber)
    query.invoiceNumber = new RegExp(filters.invoiceNumber as string, 'i');

  const invoices = await SupplierInvoice.find(query)
    .sort({ [sortBy as string]: sortOrder })
    .skip(offsetNum)
    .limit(limitNum)
    .populate('purchaseOrder', 'orderNumber');

  res.status(200).json(new SuccessResponseList('Invoices retrieved', invoices));
};

export const createSupplierInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  });

  res.status(201).json(new SuccessResponse('Invoice created', newInvoice));
};

export const updateSupplierInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
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
  console.log(status, req.body);
  const updatedInvoice = await SupplierInvoice.findByIdAndUpdate(
    id,
    { ...req.body, paymentStatus: status },
    { new: true }
  );

  res.status(200).json(new SuccessResponse('Invoice updated', updatedInvoice));
};

export const getSupplierInvoiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const invoice = await SupplierInvoice.findById(id).populate(
    'purchaseOrder',
    'orderNumber'
  );
  if (!invoice) {
    return next(new ErrorResponse('Invoice not found', 404));
  }
  res.status(200).json(new SuccessResponse('Invoice retrieved', invoice));
};

export const deleteSupplierInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  await SupplierInvoice.findByIdAndDelete(id);
  res.status(200).json(new SuccessResponse('Invoice deleted', null));
};

export const getTotalSupplierInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const total = await SupplierInvoice.countDocuments();
  res
    .status(200)
    .json(new SuccessResponse('Total invoices retrieved', { total }));
};
