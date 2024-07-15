import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 4000;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/db_test';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

const config = {
  environment: process.env.NODE_ENV,
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
  mongo: {
    uri: MONGO_URI,
  },
  jwtSecret: JWT_SECRET,
};

export default config;
