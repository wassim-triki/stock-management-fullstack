// routes/supplier.ts
import express from 'express';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
  getTotalSuppliers,
} from '../controllers/supplier';
import { authorizeRoles } from '../middleware/authorizeRoles';
import { ROLES } from '../utils/constants';
import { authHandler } from '../middleware/authHandler';
import 'express-async-errors';

const router = express.Router();
router.get('/total', authHandler, getTotalSuppliers);

// GET /api/suppliers - Get all suppliers
router.get(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getSuppliers
);

// GET /api/suppliers/:id - Get a single supplier by ID
router.get(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getSupplierById
);

// POST /api/suppliers - Create a new supplier
router.post(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  createSupplier
);

// PUT /api/suppliers/:id - Update a supplier by ID
router.put(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  updateSupplier
);

// DELETE /api/suppliers/:id - Delete a supplier by ID
router.delete(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  deleteSupplier
);

export default router;
