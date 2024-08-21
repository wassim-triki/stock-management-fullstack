import mongoose, { Schema, Document, Model } from 'mongoose';
import { ISupplier } from '../types/types';

// Define the Supplier interface

// Define the Supplier schema
const SupplierSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please use a valid email address',
      ],
      unique: true,
      lowercase: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the manager who owns this product
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

export const Supplier: Model<ISupplier> = mongoose.model<ISupplier>(
  'Supplier',
  SupplierSchema
);
