import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct, IPurchaseOrder, ISupplier } from '../types/types';
export enum OrderStatuses {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Received = 'Received',
  Draft = 'Draft',
  Canceled = 'Canceled',
}
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
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the manager who owns this product
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: OrderStatuses,
      default: OrderStatuses.Draft,
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
    vat: {
      type: Number,
      default: 0,
      min: [0, 'VAT must be at least 0'],
      max: [100, 'VAT must be at most 100'],
    },
    subTotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
    },
    receiptDate: {
      type: Date,
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

const generateRandomOrderNumber = (): string => {
  // Random alphanumeric string of length 6-8
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase(); // Converts to base-36 string
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of the current timestamp

  // Combine the random part and timestamp to form the order number
  return `${randomPart}-${timestamp}`;
};

PurchaseOrderSchema.pre<IPurchaseOrder>('save', async function (next) {
  if (this.isNew) {
    let newOrderNumber: string;

    do {
      newOrderNumber = generateRandomOrderNumber();
    } while (await PurchaseOrder.exists({ orderNumber: newOrderNumber }));

    this.orderNumber = newOrderNumber;
  }
  next();
});

export const PurchaseOrder: Model<IPurchaseOrder> =
  mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);
