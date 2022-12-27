import mongoose from 'mongoose';
import { IProduct } from '../utils/interfaces/product.interface';

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 2 },
    qty: { type: Number, default: 1 },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    specifications: [String],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
