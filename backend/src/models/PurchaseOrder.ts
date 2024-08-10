import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct, IPurchaseOrder, ISupplier } from '../types/types';

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
      enum: ['Pending', 'Accepted', 'Received'],
      default: 'Pending',
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
        price: {
          type: Number,
          required: [true, 'Price is required'],
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

PurchaseOrderSchema.pre<IPurchaseOrder>('save', async function (next) {
  if (this.isNew) {
    const lastOrder = await PurchaseOrder.findOne().sort({ orderNumber: -1 });

    const lastOrderNumber = lastOrder ? parseInt(lastOrder.orderNumber) : 0;
    this.orderNumber = (lastOrderNumber + 1).toString();
  }
  next();
});

export const PurchaseOrder: Model<IPurchaseOrder> =
  mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);
