// controllers/purchaseOrderController.ts
import { Request, Response, NextFunction } from 'express';
import { PurchaseOrder } from '../models/PurchaseOrder';
import {
  ErrorResponse,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { paginateAndSearch } from '../utils/paginateAndSearch';

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
  } catch (error: any) {
    logging.error(error);
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
    const totalPurchaseOrders = await PurchaseOrder.countDocuments();
    res.status(200).json(
      new SuccessResponse('Total purchase orders retrieved successfully', {
        total: totalPurchaseOrders,
      })
    );
  } catch (error: any) {
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
    const purchaseOrder = await PurchaseOrder.create(req.body);
    res
      .status(201)
      .json(
        new SuccessResponse(
          'Purchase Order created successfully',
          purchaseOrder
        )
      );
  } catch (error: any) {
    next(new ErrorResponse(error, 500));
  }
};

// Delete a purchase order by ID
export const deletePurchaseOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByIdAndDelete(req.params.id);
    console.log(purchaseOrder, req.params);
    if (!purchaseOrder) {
      return next(new ErrorResponse('Purchase Order not found', 404));
    }
    res
      .status(200)
      .json(
        new SuccessResponse(
          'Purchase Order deleted successfully',
          purchaseOrder
        )
      );
  } catch (error: any) {
    next(new ErrorResponse(error, 500));
  }
};

// Get a purchase order by ID
export const getPurchaseOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error: any) {
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
    console.log(';🤣🤣🤣🤣🤣', req.params);
    const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!purchaseOrder) {
      return next(new ErrorResponse('Purchase Order not found', 404));
    }

    res
      .status(200)
      .json(
        new SuccessResponse(
          'Purchase Order updated successfully',
          purchaseOrder
        )
      );
  } catch (error: any) {
    next(new ErrorResponse(error, 500));
  }
};
