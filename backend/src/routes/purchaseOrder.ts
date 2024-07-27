// routes/purchaseOrderRoutes.ts
import express from 'express';
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

export default router;
