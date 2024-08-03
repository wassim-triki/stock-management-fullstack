import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import session from 'express-session';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const MONGO_URI = process.env.MONGO_URI || `mongodb://localhost:27017/db_test`;

const SECRET = process.env.SECRET || 'secret';

const config = {
  environment: process.env.NODE_ENV,
  hostname: SERVER_HOSTNAME,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  port: PORT,
  mongo: {
    uri: MONGO_URI,
  },
  secret: SECRET,
};

export const sessionOptions: session.SessionOptions = {
  name: 'session',
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.environment === 'production',
    sameSite: 'lax',
    httpOnly: true,
  },
};

export const corsOptions = {
  origin: config.clientUrl,
  credentials: true,
};
export default config;
