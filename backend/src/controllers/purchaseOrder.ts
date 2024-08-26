// controllers/purchaseOrderController.ts
import { Request, Response, NextFunction } from 'express';
import {
  OrderStatuses,
  OrderType,
  PurchaseOrder,
} from '../models/PurchaseOrder';
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
import { ROLES, User } from '../models/User';
import { Company } from '../models/Company';

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
    // Handle status filter to allow multiple statuses (e.g., Pending.Accepted)
    if (filters.status) {
      const statuses = (filters.status as string).split('.');
      query.status = { $in: statuses };
    }
    if (filters.orderType) {
      const types = (filters.orderType as string).split('.');
      query.orderType = { $in: types };
    }

    // Managers can only retrieve their own purchase orders
    if (req.user?.role === ROLES.MANAGER) {
      query.user = req.user._id;
    }

    const purchaseOrders = await PurchaseOrder.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(offsetNum)
      .limit(limitNum)
      .populate('supplier client', 'name')
      .populate('user', 'email');

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
  const { orderType, client, supplier, ...rest } = req.body;

  if (orderType === OrderType.Supplier && !supplier) {
    return next(
      new ErrorResponse('Supplier is required for supplier orders', 400)
    );
  }

  if (orderType === OrderType.Client && !client) {
    return next(new ErrorResponse('Client is required for client orders', 400));
  }

  const purchaseOrder = await PurchaseOrder.create({
    ...rest,
    orderType,
    client: orderType === OrderType.Client ? client : null,
    supplier: orderType === OrderType.Supplier ? supplier : null,
    user: req.user?._id, // The manager creating the order
  });

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
      .populate('supplier client')
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
  const orderPending = purchaseOrder.status === OrderStatuses.Pending;
  const cancelingOrder = newStatus === OrderStatuses.Canceled;
  if (orderPending && cancelingOrder) {
    purchaseOrder.status = OrderStatuses.Canceled;
  }
  purchaseOrder.receiptDate =
    newStatus === OrderStatuses.Received ? new Date() : null;

  await purchaseOrder.save({
    validateBeforeSave: true,
  });

  res
    .status(200)
    .json(new SuccessResponse('Purchase Order updated', purchaseOrder));
};

export const getPurchaseOrderPreview = async (req: Request, res: Response) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id)
    .populate('supplier')
    .populate('items.product')
    .populate('user', '-password');

  if (!purchaseOrder) {
    throw new ErrorResponse(
      'Purchase order does not exist',
      HttpCode.NOT_FOUND
    );
  }
  const user = await User.findById(purchaseOrder.user).populate('company');

  // Generate the PDF
  const doc = generatePDF('purchaseOrder', purchaseOrder, user);

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
  const user = await User.findById(purchaseOrder.user._id);
  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }
  const doc = generatePDF('purchaseOrder', purchaseOrder, user);
  const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });
  const company = await Company.findOne({ user: user._id });

  await mailer.sendMail({
    to: purchaseOrder.supplier.email,
    from: company?.email || user.email,
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
  purchaseOrder.status = OrderStatuses.Pending;
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
  if (purchaseOrder.status !== OrderStatuses.Pending) {
    throw new ErrorResponse(`Cannot cancel ${purchaseOrder.status} order`, 400);
  }

  purchaseOrder.status = OrderStatuses.Canceled;
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

export const handleUpdateStock = async (req: Request, res: Response) => {
  const purchaseOrder = await PurchaseOrder.findById(req.body.id).populate(
    'items.product'
  );
  if (!purchaseOrder) {
    throw new ErrorResponse('Purchase Order not found', 404);
  }

  // Check the type of purchase order
  if (purchaseOrder.orderType === OrderType.Supplier) {
    for (const item of purchaseOrder.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new ErrorResponse('Product not found', 404);
      }
      // Increase stock for Supplier orders
      product.quantityInStock += item.quantity;
      await product.save();
    }
  } else if (purchaseOrder.orderType === OrderType.Client) {
    for (const item of purchaseOrder.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new ErrorResponse('Product not found', 404);
      }
      // Decrease stock for Client orders
      if (product.quantityInStock < item.quantity) {
        throw new ErrorResponse('Insufficient stock to fulfill order', 400);
      }
      product.quantityInStock -= item.quantity;
      await product.save();
    }
  }

  // Update the purchase order status to "Received"
  purchaseOrder.status = OrderStatuses.Received;
  await purchaseOrder.save();

  res.status(200).json(new SuccessResponse('Stock updated successfully'));
};
