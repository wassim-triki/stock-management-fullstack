// middleware/authorize.ts
import { Request, Response, NextFunction } from 'express';
import { Role } from '../utils/constants';
import { ErrorResponse } from '../types/types';

export const authorizeRoles = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      const error = new ErrorResponse('Not authorized', 401);
      return next(error);
    }

    if (!roles.includes(req.user?.role)) {
      const error = new ErrorResponse(
        `User role ${req.user?.role} is not authorized to access this route`,
        403
      );
      return next(error);
    }
    next();
  };
};
