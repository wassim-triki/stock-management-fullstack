// middleware/routeNotFound.ts
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/response';

export function routeNotFound(req: Request, res: Response, next: NextFunction) {
  const error = new ErrorResponse('Not found', 404);
  next(error); // Pass the error to the centralized error handler
}
