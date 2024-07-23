// middleware/authHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/types';
export function authHandler(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    console.log('🤣🤣❤️❤️❤️❤️❤️❤️❤️');
    const error = new ErrorResponse('Not authorized', 401);
    throw error;
  }
  next();
}
