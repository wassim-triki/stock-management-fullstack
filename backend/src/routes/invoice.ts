import express from 'express';
import { authHandler } from '../middleware/authHandler';
import { authorizeRoles } from '../middleware/authorizeRoles';
import {
  getInvoices,
  createInvoice,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getTotalInvoices,
} from '../controllers/invoice';
import { ROLES } from '../models/User';

const router = express.Router();

// Total invoices
router.get('/total', getTotalInvoices);

// Get invoices (auth and role-based access)
router.get(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getInvoices
);

// Create invoice (supplier or client)
router.post(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  createInvoice
);

// Update invoice
router.put(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  updateInvoice
);

// Get single invoice by ID
router.get(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getInvoiceById
);

// Delete invoice
router.delete(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  deleteInvoice
);

export default router;
