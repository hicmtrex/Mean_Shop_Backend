import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Order from '../models/order';
import Stripe from 'stripe';
import { RequestWithUser } from '../utils/interfaces/user.interface';

// @desc    create order
// @route   POST /api/orders
// @access  Private
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const pageSize: any = req.query.pageSize || 9;
    const page: any = req.query.page || 1;

    const orders = await Order.find({})
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .lean()
      .populate('user', 'username email');

    const countOrder = await Order.countDocuments({});

    if (orders) {
      res.status(201).json({
        orders,
        countOrder,
        page,
        pages: Math.ceil(countOrder / pageSize),
      });
    } else {
      res.status(404).json({ message: 'orders not found' });
    }
  }
);

// @desc    create order
// @route   POST /api/orders
// @access  Private
export const getUserOrders = asyncHandler(async (req: any, res: Response) => {
  const orders = await Order.find({ user: req.user });

  if (orders) {
    res.status(201).json(orders);
  } else {
    res.status(404).json({ message: 'orders not found' });
  }
});

// @desc    create order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req: any, res: Response) => {
  const { cartItems, shippingAddress, totalPrice } = req.body;

  const order = await Order.create({
    totalPrice,
    cartItems,
    shippingAddress,
    user: req.user._id,
  });

  if (order) {
    res.status(201).json(order);
  } else {
    res.status(500).json({ message: 'something went wrong' });
  }
});

// @desc    create order
// @route   POST /api/orders
// @access  Private
export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'username email image'
    );

    if (order) {
      res.status(201).json(order);
    } else {
      res.status(500).json({ message: 'something went wrong' });
    }
  }
);

// @desc    create order
// @route   POST /api/orders
// @access  Private
export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = req.body.isPaid;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(500).json({ message: 'something went wrong' });
  }
});

// @desc    delete order
// @route   Delete /api/orders/:id
// @access  Private
export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.remove();
    res.status(200).json('order has been deleted');
  } else {
    res.status(500).json({ message: 'something went wrong' });
  }
});

//payment
const key: string | undefined = process.env.STRIPE_SECRET_KEY || '';

const stripe = new Stripe(key, {
  apiVersion: '2022-11-15',
});

export const orderPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { stripeToken, totalPrice } = req.body;

    stripe.customers
      .create({ email: stripeToken?.email, source: stripeToken.id })
      .then((customer) => {
        return stripe.charges
          .create({
            amount: totalPrice * 100,
            description: 'Test',
            currency: 'USD',
            customer: customer.id,
          })
          .then(async (charge) => {
            res.json({ data: 'success' });
          })
          .catch((err) => {
            res.json({ data: 'fail' });
          });
      });
  }
);
