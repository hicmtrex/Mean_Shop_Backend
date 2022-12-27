import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../utils/interfaces/order.interface';

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    cartItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
