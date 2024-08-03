import { Request, Response, NextFunction } from 'express';

export function loggingHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logging.log(
    `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on('finish', () => {
    logging.log(
      `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
    );
  });

  next();
}

export function logError(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logging.error(error, 'HTTP Error');
  return next(error);
}
