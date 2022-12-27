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
exports.orderPayment = exports.deleteOrder = exports.updateOrder = exports.getOrderById = exports.createOrder = exports.getUserOrders = exports.getAllOrders = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const order_1 = __importDefault(require("../models/order"));
const stripe_1 = __importDefault(require("stripe"));
// @desc    create order
// @route   POST /api/orders
// @access  Private
exports.getAllOrders = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = req.query.pageSize || 9;
    const page = req.query.page || 1;
    const orders = yield order_1.default.find({})
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .lean()
        .populate('user', 'username email');
    const countOrder = yield order_1.default.countDocuments({});
    if (orders) {
        res.status(201).json({
            orders,
            countOrder,
            page,
            pages: Math.ceil(countOrder / pageSize),
        });
    }
    else {
        res.status(404).json({ message: 'orders not found' });
    }
}));
// @desc    create order
// @route   POST /api/orders
// @access  Private
exports.getUserOrders = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_1.default.find({ user: req.user });
    if (orders) {
        res.status(201).json(orders);
    }
    else {
        res.status(404).json({ message: 'orders not found' });
    }
}));
// @desc    create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartItems, shippingAddress, totalPrice } = req.body;
    const order = yield order_1.default.create({
        totalPrice,
        cartItems,
        shippingAddress,
        user: req.user._id,
    });
    if (order) {
        res.status(201).json(order);
    }
    else {
        res.status(500).json({ message: 'something went wrong' });
    }
}));
// @desc    create order
// @route   POST /api/orders
// @access  Private
exports.getOrderById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_1.default.findById(req.params.id).populate('user', 'username email image');
    if (order) {
        res.status(201).json(order);
    }
    else {
        res.status(500).json({ message: 'something went wrong' });
    }
}));
// @desc    create order
// @route   POST /api/orders
// @access  Private
exports.updateOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_1.default.findById(req.params.id);
    if (order) {
        order.isPaid = req.body.isPaid;
        const updatedOrder = yield order.save();
        res.status(200).json(updatedOrder);
    }
    else {
        res.status(500).json({ message: 'something went wrong' });
    }
}));
// @desc    delete order
// @route   Delete /api/orders/:id
// @access  Private
exports.deleteOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_1.default.findById(req.params.id);
    if (order) {
        yield order.remove();
        res.status(200).json('order has been deleted');
    }
    else {
        res.status(500).json({ message: 'something went wrong' });
    }
}));
//payment
const key = process.env.STRIPE_SECRET_KEY || '';
const stripe = new stripe_1.default(key, {
    apiVersion: '2022-11-15',
});
exports.orderPayment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stripeToken, totalPrice } = req.body;
    stripe.customers
        .create({ email: stripeToken === null || stripeToken === void 0 ? void 0 : stripeToken.email, source: stripeToken.id })
        .then((customer) => {
        return stripe.charges
            .create({
            amount: totalPrice * 100,
            description: 'Test',
            currency: 'USD',
            customer: customer.id,
        })
            .then((charge) => __awaiter(void 0, void 0, void 0, function* () {
            res.json({ data: 'success' });
        }))
            .catch((err) => {
            res.json({ data: 'fail' });
        });
    });
}));
