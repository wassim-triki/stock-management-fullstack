import express from 'express';
import http from 'http';
import bodyParser, { json } from 'body-parser';
import { connectDB } from './config/db';
import logging from './config/logging';
import './config/config';
import config from './config/config';
import { corsHandler } from './middleware/corsHandler';
import { loggingHandler } from './middleware/loggingHandler';
import { routeNotFound } from './middleware/routNotFound';
import authRouter from './routes/auth';
import userRoutes from './routes/user';
import { createTestUsers } from './utils/createTestUsers';
import errorHandler from './middleware/errorHandler';
import { createRouteHandler } from 'uploadthing/express';
import { uploadRouter } from './utils/uploadthing';
import { authHandler } from './middleware/authHandler';

export const app = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = async () => {
  logging.log('----------------------------------------');
  logging.log('Initializing API');
  logging.log('----------------------------------------');
  await connectDB();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  logging.log('Logging & Configuration');
  logging.log('----------------------------------------');
  app.use(loggingHandler);
  app.use(corsHandler);
  app.use(bodyParser.json());
  logging.log('Define Controller Routing');
  logging.log('----------------------------------------');
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRoutes);
  app.use(
    '/api/uploadthing',
    authHandler,
    createRouteHandler({
      router: uploadRouter,
    })
  );
  // app.use('/api/private', require('./routes/private'));
  app.get('/healthcheck', (req, res, next) => {
    return res.status(200).json({ hello: 'world!' });
  });

  logging.log('Define Routing Error');
  logging.log('----------------------------------------');
  app.use(routeNotFound);
  app.use(errorHandler);

  logging.log('Starting Server');
  logging.log('----------------------------------------');
  httpServer = http.createServer(app);
  httpServer.listen(config.port, () => {
    logging.log(`Server started on ${config.hostname}:${config.port}`);
    logging.log('----------------------------------------');
  });

  await createTestUsers();
};

export const Shutdown = (callback: any) =>
  httpServer && httpServer.close(callback);

Main();
