import { Request, Response, NextFunction } from 'express';

export function corsHandler(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Authorization, Accept'
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.sendStatus(200);
  }
  next();
}
