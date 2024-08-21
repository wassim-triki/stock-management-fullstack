// models/Product.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct } from '../types/types';

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the manager who owns this product
      required: true,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    description: {
      type: String,
    },
    quantityInStock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> = mongoose.model<IProduct>(
  'Product',
  ProductSchema
);
