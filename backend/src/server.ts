// server.ts
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { connectDB } from './config/db';
import logging from './config/logging';
import './config/config';
import config from './config/config';
import { corsHandler } from './middleware/corsHandler';
import { loggingHandler } from './middleware/loggingHandler';
import authRouter from './routes/auth';
import userRoutes from './routes/user';
import supplierRoutes from './routes/supplier';
import categoryRoutes from './routes/category';
import productRoutes from './routes/product';
import errorHandler from './middleware/errorHandler';
import { createRouteHandler } from 'uploadthing/express';
import { uploadRouter } from './utils/uploadthing';
import session from 'express-session';
import passport from './config/passport';
import { authHandler } from './middleware/authHandler';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { seedData } from './utils/seedData';

export const app = express();
export let httpServer: ReturnType<typeof http.createServer>;
const origin = config.clientUrl;
const corsConfig = {
  origin,
  credentials: true,
};

export const Main = async () => {
  logging.log('----------------------------------------');
  logging.log('Initializing API');
  logging.log('----------------------------------------');
  await connectDB();

  // Call the seedData function
  await seedData();

  app.use(cors(corsConfig));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

  app.use(
    session({
      name: 'session',
      secret: config.jwtSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: config.environment === 'production',
        sameSite: 'lax',
        httpOnly: true,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  logging.log('Logging & Configuration');
  logging.log('----------------------------------------');
  app.use(loggingHandler);
  logging.log('Define Controller Routing');
  logging.log('----------------------------------------');
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRoutes);
  app.use('/api/suppliers', supplierRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/products', productRoutes);

  app.use(
    '/api/uploadthing',
    authHandler,
    createRouteHandler({
      router: uploadRouter,
    })
    // TODO: Fix the return error from uploadthing server
  );
  app.get('/healthcheck', (req, res) => {
    return res.status(200).json({ hello: 'world!' });
  });

  logging.log('Define Routing Error');
  logging.log('----------------------------------------');
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
