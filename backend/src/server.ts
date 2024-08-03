// server.ts
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { connectDB } from './config/db';
import logging from './config/logging';
import './config/config';
import config, { corsOptions, sessionOptions } from './config/config';
import { logError, loggingHandler } from './middleware/loggingHandler';
import errorHandler from './middleware/errorHandler';
import session from 'express-session';
import passport from './config/passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { seedData } from './utils/seedData';
import routes from './routes';
import helmet from 'helmet';
export const app = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = async () => {
  logging.log('----------------------------------------');
  logging.log('Initializing API');
  logging.log('----------------------------------------');
  await connectDB();

  // Call the seedData function
  await seedData();

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(session(sessionOptions));
  app.use(passport.initialize());
  app.use(passport.session());

  logging.log('Logging & Configuration');
  logging.log('----------------------------------------');
  app.use(loggingHandler);
  logging.log('Define Controller Routing');
  logging.log('----------------------------------------');
  app.use(routes);
  logging.log('Define Routing Error');
  logging.log('----------------------------------------');
  app.use(logError);
  app.use(errorHandler);

  logging.log('Starting Server');
  logging.log('----------------------------------------');
  httpServer = http.createServer(app);
  httpServer.listen(config.port, () => {
    logging.log(`Server started on ${config.hostname}:${config.port}`);
    logging.log('----------------------------------------');
  });
};

export const Shutdown = (callback: any) =>
  httpServer && httpServer.close(callback);

Main();

const cleanup = (type: string) => (err: any) => {
  Shutdown(() => {
    logging.error(`${err.message} :: ${type} :: Shutting Down`);
    process.exit(1);
  });
};

process.on('uncaughtException', cleanup('uncaughtException'));
process.on('unhandledRejection', cleanup('unhandledRejection'));
