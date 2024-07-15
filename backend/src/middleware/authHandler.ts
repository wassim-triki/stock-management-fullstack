// middleware/routeNotFound.ts
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';

export function authHandler(req: Request, res: Response, next: NextFunction) {
  const isAuth = false;
  if (!isAuth) {
    const error = new ErrorResponse('Not authorized', 401);
    next(error); // Pass the error to the centralized error handler
  }
  next();
}
