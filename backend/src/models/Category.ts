// models/Category.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICategory } from '../types/types';

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
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

export const Category: Model<ICategory> = mongoose.model<ICategory>(
  'Category',
  CategorySchema
);
