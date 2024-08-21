import express from 'express';
import { authHandler } from '../middleware/authHandler';
import { authorizeRoles } from '../middleware/authorizeRoles';
import { ROLES } from '../utils/constants';
import {
  getSupplierInvoices,
  createSupplierInvoice,
  getSupplierInvoiceById,
  updateSupplierInvoice,
  deleteSupplierInvoice,
  getTotalSupplierInvoices,
} from '../controllers/supplierInvoices';

const router = express.Router();
router.get('/total', getTotalSupplierInvoices);
router.get(
  '/',
  // authHandler,
  // authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getSupplierInvoices
);
router.post(
  '/',
  // authHandler,
  // authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  createSupplierInvoice
);
router.put('/:id', updateSupplierInvoice);

router.get('/:id', getSupplierInvoiceById);
router.delete('/:id', deleteSupplierInvoice);
export default router;
