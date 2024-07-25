// routes/supplier.ts
import express from 'express';

import { authorizeRoles } from '../middleware/authorizeRoles';
import { ROLES } from '../utils/constants';
import { authHandler } from '../middleware/authHandler';
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getTotalProducts,
  updateProduct,
} from '../controllers/product';

const router = express.Router();
router.get('/total', authHandler, getTotalProducts);

// GET /api/suppliers - Get all suppliers
router.get(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getProducts
);

// GET /api/suppliers/:id - Get a single supplier by ID
router.get(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getProductById
);

// POST /api/suppliers - Create a new supplier
router.post(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  createProduct
);

// PUT /api/suppliers/:id - Update a supplier by ID
router.put(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  updateProduct
);

// DELETE /api/suppliers/:id - Delete a supplier by ID
router.delete(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  deleteProduct
);

export default router;
