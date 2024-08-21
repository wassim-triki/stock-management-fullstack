// routes/purchaseOrderRoutes.ts
import express, { Request, Response } from 'express';
import {
  createPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  getPurchaseOrderPreview,
  getPurchaseOrders,
  getTotalPurchaseOrders,
  handleCancelOrder,
  sendPurchaseOrder,
  updatePurchaseOrder,
  handleAddToStock,
} from '../controllers/purchaseOrder';
import { authorizeRoles } from '../middleware/authorizeRoles';
import { authHandler } from '../middleware/authHandler';
import 'express-async-errors';
import { ROLES } from '../models/User';
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

router.get(
  '/:id/print',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getPurchaseOrderPreview
);
router.post(
  '/:id/send',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  sendPurchaseOrder
);
router.post(
  '/:id/cancel',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  handleCancelOrder
);
router.post(
  '/add-to-stock',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  handleAddToStock
);
export default router;
