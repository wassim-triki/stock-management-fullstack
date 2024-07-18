// middleware/authHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/response';

export function authHandler(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    const error = new ErrorResponse('Not authorized', 401);
    return next(error); // Pass the error to the centralized error handler
  }
  next();
}
