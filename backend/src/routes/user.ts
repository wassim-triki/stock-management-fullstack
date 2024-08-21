import express from 'express';
import {
  getAllUsers,
  getUserById,
  deleteUser,
  createUser,
  getTotalUsers,
  updateUser,
} from '../controllers/user';
import { authHandler } from '../middleware/authHandler';
import { authorizeRoles } from '../middleware/authorizeRoles';
import 'express-async-errors';
import { ROLES } from '../models/User';
const router = express.Router();

router.get('/total', authHandler, getTotalUsers);
router.get('/', authHandler, authorizeRoles(ROLES.ADMIN), getAllUsers);
router.get('/:id', authHandler, authorizeRoles(ROLES.ADMIN), getUserById);
router.delete('/:id', authHandler, authorizeRoles(ROLES.ADMIN), deleteUser);
router.post('/', authHandler, authorizeRoles(ROLES.ADMIN), createUser);
router.put('/:id', authHandler, authorizeRoles(ROLES.ADMIN), updateUser);

export default router;
