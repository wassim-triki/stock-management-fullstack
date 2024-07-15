import { ConnectOptions } from 'mongodb';
import mongoose from 'mongoose';
import config from './config';

export const connectDB = async () => {
  try {
    logging.log('Connecting to MongoDB...');
    logging.log('----------------------------------------');
    await mongoose.connect(config.mongo.uri);
    logging.log('MongoDB Connected');
    logging.log('----------------------------------------');
  } catch (error) {
    logging.error('Failed to connect to MongoDB:', error);
  }
};
