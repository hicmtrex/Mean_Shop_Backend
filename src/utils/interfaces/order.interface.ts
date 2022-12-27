import { ObjectId } from 'mongoose';
import { IUser } from '../../models/user';

export interface CartItems {
  _id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IOrder {
  _id: string;
  user: ObjectId | IUser;
  cartItems: CartItems[];
  shippingAddress: ShippingAddress;
  totalPrice: number;
  isPaid: boolean;
}
