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
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    quantityInStock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    // reorderLevel: {
    //   type: Number,
    //   required: [true, 'Reorder level is required'],
    //   min: [0, 'Reorder level cannot be negative'],
    // },
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
