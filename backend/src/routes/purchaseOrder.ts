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
} from '../controllers/purchaseOrder';
import { authorizeRoles } from '../middleware/authorizeRoles';
import { authHandler } from '../middleware/authHandler';
import { ROLES } from '../utils/constants';
import 'express-async-errors';
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

export default router;
