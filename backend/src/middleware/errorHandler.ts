// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/types';

const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error (add more sophisticated logging if needed)
  console.error(err);

  // Ensure the error has a statusCode and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';
  // const code = err.code || 'SERVER_ERROR';
  const data = err.data || [];

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    data,
  });
};

export default errorHandler;
