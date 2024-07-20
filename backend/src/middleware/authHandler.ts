// middleware/authHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/response';

export function authHandler(req: Request, res: Response, next: NextFunction) {
  logging.warning(req.cookies, req.isAuthenticated());
  if (!req.isAuthenticated()) {
    const error = new ErrorResponse('Not authorized', 401);
    throw error;
  }
  next();
}
