import express from 'express';
import {
  getAllUsers,
  getUserById,
  deleteUser,
  createUser,
} from '../controllers/user';
import { authHandler } from '../middleware/authHandler';
import { authorizeRoles } from '../middleware/authorizeRoles';

const router = express.Router();

router.get('/', authHandler, authorizeRoles('admin'), getAllUsers);
router.get('/:id', authHandler, authorizeRoles('admin'), getUserById);
router.delete('/:id', authHandler, authorizeRoles('admin'), deleteUser);
router.post('/', authHandler, authorizeRoles('admin'), createUser);

export default router;
