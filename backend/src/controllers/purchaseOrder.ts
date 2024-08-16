// controllers/purchaseOrderController.ts
import { Request, Response, NextFunction } from 'express';
import { getNextOrderNumber, PurchaseOrder } from '../models/PurchaseOrder';
import {
  ErrorResponse,
  IPurchaseOrder,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { paginateAndSearch } from '../utils/paginateAndSearch';
import { generatePDF } from '../services/pdfService';
import { Supplier } from '../models/Supplier';
import { Product } from '../models/Product';
import mailer from '../services/mailer';

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
  const populted = await populateOrderData(req.body);
  await Mailer.sendMail({
    to: populted.supplier.email,
    subject: 'New Purchase Order',
    text: `A new purchase order has been created with order number ${populted.orderNumber}.`,
  });
  const purchaseOrder = await (
    await PurchaseOrder.create(req.body)
  ).populate('supplier', 'email');
  res
    .status(201)
    .json(new SuccessResponse('Purchase Order sent', purchaseOrder));
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
      new SuccessResponse('Purchase Order updated successfully', purchaseOrder)
    );
};

export const previewPurchaseOrderPDF = async (req: Request, res: Response) => {
  console.log(';🤣🤣🤣🤣🤣', req.body);

  const orderData = req.body; // Form data sent in the request body

  // Assuming the supplier and product details need to be populated
  console.log(orderData);
  const populatedOrderData = await populateOrderData(orderData);

  // Generate the PDF
  const doc = generatePDF('purchaseOrder', populatedOrderData);

  // Set headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=purchase_order_${
      orderData.orderNumber || 'preview'
    }.pdf`
  );

  // Pipe the PDF document directly to the response
  doc.pipe(res);
};

// Function to populate the order data with supplier and product names
async function populateOrderData(orderData: any): Promise<IPurchaseOrder> {
  // Replace these with your actual models and logic to fetch supplier and product details

  const orderNumber = await getNextOrderNumber();
  const supplier = await Supplier.findById(orderData.supplier);
  const items = await Promise.all(
    orderData.items.map(async (item: any) => {
      const product = await Product.findById(item.product);
      return {
        ...item,
        product,
      };
    })
  );

  return {
    ...orderData,
    orderNumber,
    supplier,
    items,
  };
}

export const sendPurchaseOrderEmail = async (req: Request, res: Response) => {
  const orderData = req.body; // Form data sent in the request body
  const populatedOrderData = await populateOrderData(orderData);
  const doc = generatePDF('purchaseOrder', populatedOrderData);
  const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });

  const emailResult = await mailer.sendMail({
    to: orderData.supplier.email,
    subject: 'Purchase Order',
    text: 'Please find attached your purchase order.',
    attachments: [
      {
        filename: `purchase_order_${orderData.orderNumber || 'preview'}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
  res
    .status(200)
    .json({ message: 'Purchase order sent successfully', emailResult });
};
