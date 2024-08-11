// routes/purchaseOrderRoutes.ts
import express, { Request, Response } from 'express';
import {
  createPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  getPurchaseOrders,
  getTotalPurchaseOrders,
  updatePurchaseOrder,
} from '../controllers/purchaseOrder';
import { authorizeRoles } from '../middleware/authorizeRoles';
import { authHandler } from '../middleware/authHandler';
import { ROLES } from '../utils/constants';
import 'express-async-errors';
import { generatePDF } from '../services/pdfService';
import { Supplier } from '../models/Supplier';
import { Product } from '../models/Product';
import { getNextOrderNumber } from '../models/PurchaseOrder';
import { IPurchaseOrder } from '../types/types';
const router = express.Router();

router.get('/total', authHandler, getTotalPurchaseOrders);
router.get(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getPurchaseOrders
);
router.post(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  createPurchaseOrder
);
router.delete(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  deletePurchaseOrder
);
router.get(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getPurchaseOrderById
);
router.put(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  updatePurchaseOrder
);

router.post('/preview', async (req: Request, res: Response) => {
  const orderData = req.body; // Form data sent in the request body

  // Assuming the supplier and product details need to be populated
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
});

export default router;

// Function to populate the order data with supplier and product names
const populateOrderData = async (orderData: any): Promise<IPurchaseOrder> => {
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
};
