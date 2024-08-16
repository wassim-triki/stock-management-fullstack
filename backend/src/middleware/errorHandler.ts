// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import config from '../config/config';

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode =
    error.statusCode && error.statusCode > 99 && error.statusCode < 600
      ? error.statusCode
      : 500;
  const message = error.message || 'Internal Server Error';
  const stack = config.environment === 'production' ? undefined : error.stack;
  const data = error.data;
  console.log('👍👍👍👍👍👍👍');
  res.status(statusCode).json({ message, statusCode, data, stack });
};

export default errorHandler;
