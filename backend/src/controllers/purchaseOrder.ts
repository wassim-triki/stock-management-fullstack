// controllers/purchaseOrderController.ts
import { Request, Response, NextFunction } from 'express';
import { getNextOrderNumber, PurchaseOrder } from '../models/PurchaseOrder';
import {
  ErrorResponse,
  HttpCode,
  IPurchaseOrder,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { paginateAndSearch } from '../utils/paginateAndSearch';
import { generatePDF } from '../services/pdfService';
import { Supplier } from '../models/Supplier';
import { Product } from '../models/Product';
import mailer from '../services/mailer';
import { PO_STATUSES } from '../utils/constants';

export type QueryParams = {
  limit?: string;
  offset?: string;
  [key: string]: string | undefined;
};

export const getPurchaseOrders = async (
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
  if (filters.orderNumber)
    query.orderNumber = new RegExp(filters.orderNumber as string, 'i');

  const purchaseOrders = await PurchaseOrder.find(query)
    .sort({ [sortBy as string]: sortOrder })
    .skip(offsetNum)
    .limit(limitNum)
    .populate('supplier', 'name');

  res
    .status(200)
    .json(
      new SuccessResponseList(
        'Purchase orders retrieved successfully',
        purchaseOrders
      )
    );
};
// Get total purchase orders
export const getTotalPurchaseOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const totalPurchaseOrders = await PurchaseOrder.countDocuments();
  res.status(200).json(
    new SuccessResponse('Total purchase orders retrieved successfully', {
      total: totalPurchaseOrders,
    })
  );
};

// Create a purchase order
export const createPurchaseOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const purchaseOrder = await await PurchaseOrder.create(req.body);
  res
    .status(201)
    .json(new SuccessResponse('Purchase Order created', purchaseOrder));
};

// Delete a purchase order by ID
export const deletePurchaseOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const purchaseOrder = await PurchaseOrder.findByIdAndDelete(req.params.id);
  console.log(purchaseOrder, req.params);
  if (!purchaseOrder) {
    return next(new ErrorResponse('Purchase Order not found', 404));
  }
  res
    .status(200)
    .json(
      new SuccessResponse('Purchase Order deleted successfully', purchaseOrder)
    );
};

// Get a purchase order by ID
export const getPurchaseOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id).populate(
    'supplier items.product'
  );
  if (!purchaseOrder) {
    return next(new ErrorResponse('Purchase Order not found', 404));
  }
  res
    .status(200)
    .json(
      new SuccessResponse(
        'Purchase Order retrieved successfully',
        purchaseOrder
      )
    );
};

// Update a purchase order by ID
export const updatePurchaseOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id);
  if (!purchaseOrder) {
    throw new ErrorResponse('Purchase Order not found', 404);
  }
  const orderPending = purchaseOrder.status === PO_STATUSES.PENDING;
  const cancelingOrder = req.body.status === PO_STATUSES.CANCELED;
  if (orderPending && cancelingOrder) {
    purchaseOrder.status = PO_STATUSES.CANCELED;
    await purchaseOrder.save();
    return res
      .status(200)
      .json(new SuccessResponse('Purchase Order cancelled'));
  }

  await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res
    .status(200)
    .json(
      new SuccessResponse('Purchase Order updated successfully', purchaseOrder)
    );
};

export const getPurchaseOrderPreview = async (req: Request, res: Response) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id)
    .populate('supplier')
    .populate('items.product');

  if (!purchaseOrder) {
    throw new ErrorResponse(
      'Purchase order does not exist',
      HttpCode.NOT_FOUND
    );
  }

  // Generate the PDF
  const doc = generatePDF('purchaseOrder', purchaseOrder);

  // Set headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=purchase_order_${
      purchaseOrder.orderNumber || 'preview'
    }.pdf`
  );

  // Pipe the PDF document directly to the response
  doc.pipe(res);
};

export const sendPurchaseOrder = async (req: Request, res: Response) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id)
    .populate('supplier')
    .populate('items.product');
  if (!purchaseOrder) {
    throw new ErrorResponse('Purchase Order not found', 404);
  }
  const doc = generatePDF('purchaseOrder', purchaseOrder);
  const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });
  await mailer.sendMail({
    to: purchaseOrder.supplier.email,
    subject: 'Purchase Order',
    text: 'Please find attached your purchase order.',
    attachments: [
      {
        filename: `purchase_order_${
          purchaseOrder.orderNumber || 'preview'
        }.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
  purchaseOrder.status = PO_STATUSES.PENDING;
  await purchaseOrder.save();
  res
    .status(200)
    .json(new SuccessResponse('Email sent to' + purchaseOrder.supplier.email));
};

export const handleCancelOrder = async (req: Request, res: Response) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id)
    .populate('supplier')
    .populate('items.product');
  if (!purchaseOrder) {
    throw new ErrorResponse('Purchase Order not found', 404);
  }
  if (purchaseOrder.status !== PO_STATUSES.PENDING) {
    throw new ErrorResponse(`Cannot cancel ${purchaseOrder.status} order`, 400);
  }

  purchaseOrder.status = PO_STATUSES.CANCELED;
  await mailer.sendMail({
    to: purchaseOrder.supplier.email,
    subject: 'Cancel Purchase Order',
    text:
      'Please cancel the purchase order with order number:' +
      purchaseOrder.orderNumber,
  });
  await purchaseOrder.save();
  res
    .status(200)
    .json(new SuccessResponse('Purchase Order cancelled', purchaseOrder));
};
