import mongoose, { Schema, Document, Model } from 'mongoose';
import { ISupplier } from '../types/types';

// Define the Supplier interface

// Define the Supplier schema
const SupplierSchema: Schema = new Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please use a valid email address',
      ],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
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
