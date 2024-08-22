import express from 'express';
import { authHandler } from '../middleware/authHandler';
import { authorizeRoles } from '../middleware/authorizeRoles';
import { ROLES } from '../models/User';
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompanyById,
  getTotalCompanies,
  updateCompany,
} from '../controllers/company';
import { checkEmailAvailability } from '../controllers/auth';
const router = express.Router();

router.get('/', authHandler, authorizeRoles(ROLES.ADMIN), getCompanies);
router.get(
  '/total',
  authHandler,
  authorizeRoles(ROLES.ADMIN),
  getTotalCompanies
);
router.post(
  '/',
  authHandler,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  checkEmailAvailability,
  createCompany
);
router.put(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  checkEmailAvailability,
  updateCompany
);
router.delete(
  '/:id',
  authHandler,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  deleteCompany
);

router.get('/:id', authHandler, authorizeRoles(ROLES.ADMIN), getCompanyById);

export default router;
