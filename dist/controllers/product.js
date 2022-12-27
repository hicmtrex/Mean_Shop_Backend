"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.createProduct = exports.deleteProduct = exports.getProductByUd = exports.getAllProducts = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const product_1 = __importDefault(require("../models/product"));
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.getAllProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = req.query.pageSize || 9;
    const page = req.query.page || 1;
    const searchQuery = req.query.query || '';
    const category = req.query.category || '';
    const queryFilter = searchQuery && searchQuery !== 'all'
        ? {
            name: {
                $regex: searchQuery,
                $options: 'i',
            },
        }
        : {};
    const categories = yield product_1.default.find({}).distinct('category');
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const products = yield product_1.default.find(Object.assign(Object.assign({}, queryFilter), categoryFilter))
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .lean();
    const countOffer = yield product_1.default.countDocuments(Object.assign(Object.assign({}, queryFilter), categoryFilter));
    if (products) {
        res.status(200).json({
            countOffer,
            products,
            categories,
            page,
            pages: Math.ceil(countOffer / pageSize),
        });
    }
    else {
        res.status(404).json({ message: 'products not found!' });
    }
}));
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.getProductByUd = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_1.default.findById(req.params.id);
    if (product) {
        res.status(200).json(product);
    }
    else {
        res.status(404).json({ message: 'Product not found!' });
    }
}));
// @desc    Delete User
// @route   Delete /api/products/:id
// @access  Private/Admin
exports.deleteProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_1.default.findById(req.params.id);
    if (product) {
        yield product.remove();
        res.status(200).json('product has been deleted');
    }
    else {
        res.status(404).json({ message: 'Product not found!' });
    }
}));
// @desc    Delete User
// @route   Delete /api/products/:id
// @access  Private/Admin
exports.createProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_1.default.create(req.body);
    if (product) {
        res.status(201).json(product);
    }
    else {
        res.status(400).json({ message: 'Something Went Wrong' });
    }
}));
// @desc    Delete User
// @route   Delete /api/products/:id
// @access  Private/Admin
exports.updateProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (product) {
        res.status(200).json(product);
    }
    else {
        res.status(400).json({ message: 'Something Went Wrong' });
    }
}));
