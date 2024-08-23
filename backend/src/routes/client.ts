import express from 'express';

import { authorizeRoles } from '../middleware/authorizeRoles';
import { authHandler } from '../middleware/authHandler';
import 'express-async-errors';
import { ROLES } from '../models/User';
import {
  createClient,
  deleteClient,
  getClientById,
  getClients,
  getTotalClients,
  updateClient,
} from '../controllers/client';
const router = express.Router();
router.get('/total', authHandler, getTotalClients);

router.get(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getClients
);

router.get(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  getClientById
);

router.post(
  '/',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  createClient
);

router.put(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  updateClient
);

router.delete(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
  deleteClient
);

export default router;
