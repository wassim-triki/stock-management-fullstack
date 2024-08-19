import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct, IPurchaseOrder, ISupplier } from '../types/types';
import { PO_STATUSES } from '../utils/constants';

const PurchaseOrderSchema: Schema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: [true, 'Order number must be unique'],
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: [true, 'Supplier is required'],
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: PO_STATUSES,
      default: 'Draft',
    },
    orderTotal: {
      type: Number,
      required: [true, 'Order total is required'],
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
        unitPrice: {
          type: Number,
          required: [true, 'Unit price is required'],
        },
        lineTotal: {
          type: Number,
          required: [true, 'Line total is required'],
        },
      },
    ],
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

export const getNextOrderNumber = async (): Promise<string> => {
  const lastOrder = await PurchaseOrder.findOne().sort({ orderNumber: -1 });

  const lastOrderNumber = lastOrder ? parseInt(lastOrder.orderNumber, 10) : 0;
  const nextOrderNumber = (lastOrderNumber + 1).toString();

  // Ensure the order number is padded to 6 digits with leading zeros
  return nextOrderNumber.padStart(6, '0');
};

PurchaseOrderSchema.pre<IPurchaseOrder>('save', async function (next) {
  if (this.isNew) {
    this.orderNumber = await getNextOrderNumber();
  }
  next();
});

export const PurchaseOrder: Model<IPurchaseOrder> =
  mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);
