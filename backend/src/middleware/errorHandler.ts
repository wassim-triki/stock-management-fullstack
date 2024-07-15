// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/response';

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
  const details = err.details || undefined;

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      // code,
      ...(details && { details }),
    },
  });
};

export default errorHandler;
