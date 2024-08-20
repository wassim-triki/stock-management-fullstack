import mongoose, { Schema, Document, Model } from 'mongoose';
import { IDelivery } from '../types/types';

export enum DeliveryStatuses {
  PARTIAL = 'Partial',
  COMPLETE = 'Complete',
}
const DeliverySchema = new Schema(
  {
    purchaseOrder: {
      type: Schema.Types.ObjectId,
      ref: 'PurchaseOrder',
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 }, // Actual quantity delivered
      },
    ],
    date: { type: Date, default: Date.now },
    note: { type: String }, // Optional notes
    status: {
      type: String,
      enum: DeliveryStatuses,
      default: DeliveryStatuses.PARTIAL,
    },
  },
  { timestamps: true }
);

export const Delivery: Model<IDelivery> = mongoose.model<IDelivery>(
  'Delivery',
  DeliverySchema
);
