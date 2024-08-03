// middleware/authorize.ts
import { Request, Response, NextFunction } from 'express';
import { Role } from '../utils/constants';
import { ErrorResponse, HttpCode } from '../types/types';

export const authorizeRoles = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      const error = new ErrorResponse('Not authorized', HttpCode.UNAUTHORIZED);
      return next(error);
    }

    if (!roles.includes(req.user?.role)) {
      const error = new ErrorResponse(
        `User role ${req.user?.role} is not authorized to access this route`,
        HttpCode.UNAUTHORIZED
      );
      return next(error);
    }
    next();
  };
};
