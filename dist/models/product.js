"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
