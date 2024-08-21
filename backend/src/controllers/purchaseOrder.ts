// controllers/purchaseOrderController.ts
import { Request, Response, NextFunction } from 'express';
import { PO_STATUSES, PurchaseOrder } from '../models/PurchaseOrder';
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
import { ROLES } from '../models/User';

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
    if (filters.orderNumber)
      query.orderNumber = new RegExp(filters.orderNumber as string, 'i');

    // Managers can only retrieve their own purchase orders
    if (req.user?.role === ROLES.MANAGER) {
      query.user = req.user._id;
    }

    const purchaseOrders = await PurchaseOrder.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(offsetNum)
      .limit(limitNum)
      .populate('supplier', 'name');

    res
      .status(200)
      .json(
        new SuccessResponseList('Purchase orders retrieved', purchaseOrders)
      );
  } catch (error) {
    next(new ErrorResponse('Failed to retrieve purchase orders', 500));
  }
};

// Get total purchase orders
export const getTotalPurchaseOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query =
      req.user?.role === ROLES.MANAGER ? { user: req.user._id } : {};
    const totalPurchaseOrders = await PurchaseOrder.countDocuments(query);

    res.status(200).json(
      new SuccessResponse('Total purchase orders retrieved', {
        total: totalPurchaseOrders,
      })
    );
  } catch (error) {
    next(new ErrorResponse('Failed to retrieve total purchase orders', 500));
  }
};

// Create a purchase order
export const createPurchaseOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchaseOrder = await PurchaseOrder.create({
      ...req.body,
      user: req.user?._id, // Assign the purchase order to the user creating it
    });
    res
      .status(201)
      .json(new SuccessResponse('Purchase Order created', purchaseOrder));
  } catch (error) {
    next(new ErrorResponse('Failed to create purchase order', 500));
  }
};

// Delete a purchase order by ID
export const deletePurchaseOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);

    if (!purchaseOrder) {
      return next(new ErrorResponse('Purchase Order not found', 404));
    }

    // Managers can only delete their own purchase orders
    if (
      req.user?.role === ROLES.MANAGER &&
      purchaseOrder.user.toString() !== (req.user._id as string).toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to delete this order',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    await purchaseOrder.deleteOne();
    res
      .status(200)
      .json(new SuccessResponse('Purchase Order deleted', purchaseOrder));
  } catch (error) {
    next(new ErrorResponse('Failed to delete purchase order', 500));
  }
};

// Get a purchase order by ID
export const getPurchaseOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id)
      .populate('supplier')
      .populate('items.product');

    if (!purchaseOrder) {
      return next(new ErrorResponse('Purchase Order not found', 404));
    }

    // Managers can only access their own purchase orders
    if (
      req.user?.role === ROLES.MANAGER &&
      purchaseOrder.user.toString() !== (req.user._id as string).toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to access this resource',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    res
      .status(200)
      .json(new SuccessResponse('Purchase Order retrieved', purchaseOrder));
  } catch (error) {
    next(new ErrorResponse('Failed to retrieve purchase order', 500));
  }
};

// Update a purchase order by ID
export const updatePurchaseOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);
    if (!purchaseOrder) {
      return next(new ErrorResponse('Purchase Order not found', 404));
    }

    // Managers can only update their own purchase orders
    if (
      req.user?.role === ROLES.MANAGER &&
      purchaseOrder.user.toString() !== (req.user._id as string).toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to update this order',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    const newStatus = req.body.status;
    const orderPending = purchaseOrder.status === PO_STATUSES.PENDING;
    const cancelingOrder = newStatus === PO_STATUSES.CANCELED;
    if (orderPending && cancelingOrder) {
      purchaseOrder.status = PO_STATUSES.CANCELED;
    }
    purchaseOrder.receiptDate =
      newStatus === PO_STATUSES.RECEIVED ? new Date() : null;

    await purchaseOrder.save({
      validateBeforeSave: true,
    });

    res
      .status(200)
      .json(new SuccessResponse('Purchase Order updated', purchaseOrder));
  } catch (error) {
    next(new ErrorResponse('Failed to update purchase order', 500));
  }
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

export const handleAddToStock = async (req: Request, res: Response) => {
  const purchaseOrder = await PurchaseOrder.findById(req.body.id).populate(
    'items.product'
  );
  if (!purchaseOrder) {
    throw new ErrorResponse('Purchase Order not found', 404);
  }

  for (const item of purchaseOrder.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ErrorResponse('Product not found', 404);
    }
    //TODO: + quantityReceived
    product.quantityInStock += item.quantity;
    await product.save();
  }

  purchaseOrder.status = PO_STATUSES.RECEIVED;
  await purchaseOrder.save();
  res.status(200).json(new SuccessResponse('Stock updated'));
};
