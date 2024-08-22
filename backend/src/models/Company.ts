import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICompany } from '../types/types';

// Define the Company schema
const CompanySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: String },
    address: { type: String },
    website: { type: String },
    phone: { type: String },
    email: {
      type: String,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please use a valid email address',
      ],
      required: true,
    },
    // Add a reference to the User model to signify ownership
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Create the Company model
export const Company: Model<ICompany> = mongoose.model<ICompany>(
  'Company',
  CompanySchema
);
