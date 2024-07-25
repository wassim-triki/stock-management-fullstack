// routes/supplier.ts
import express from 'express';

import { authorizeRoles } from '../middleware/authorizeRoles';
import { ROLES } from '../utils/constants';
import { authHandler } from '../middleware/authHandler';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getTotalCategories,
  updateCategory,
} from '../controllers/category';

const router = express.Router();
router.get('/total', authHandler, getTotalCategories);

// GET /api/suppliers - Get all suppliers
router.get(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getCategories
);

// GET /api/suppliers/:id - Get a single supplier by ID
router.get(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getCategoryById
);

// POST /api/suppliers - Create a new supplier
router.post(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  createCategory
);

// PUT /api/suppliers/:id - Update a supplier by ID
router.put(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  updateCategory
);

// DELETE /api/suppliers/:id - Delete a supplier by ID
router.delete(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  deleteCategory
);

export default router;
