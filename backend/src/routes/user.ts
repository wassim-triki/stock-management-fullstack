import express from 'express';
import { getAllUsers, getUserById, deleteUser } from '../controllers/user';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

export default router;
