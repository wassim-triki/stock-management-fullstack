// routes/supplier.ts
import express from 'express';

import { authorizeRoles } from '../middleware/authorizeRoles';
import { authHandler } from '../middleware/authHandler';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getTotalCategories,
  updateCategory,
} from '../controllers/category';
import 'express-async-errors';
import { ROLES } from '../models/User';
const router = express.Router();
router.get('/total', authHandler, getTotalCategories);

router.get(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getCategories
);

router.get(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getCategoryById
);

router.post(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  createCategory
);

router.put(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  updateCategory
);

router.delete(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  deleteCategory
);

export default router;
