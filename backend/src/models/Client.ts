import mongoose, { Schema, Document, Model } from 'mongoose';
import { IClient } from '../types/types';

// Define the Client schema
const ClientSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
    },
    email: {
      type: String,
      required: [true, 'Client contact email is required'],
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please use a valid email address',
      ],
      lowercase: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the stock manager who owns this client
      required: true,
    },
    phone: {
      type: String,
    },
    address: { type: String },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Client: Model<IClient> = mongoose.model<IClient>(
  'Client',
  ClientSchema
);
