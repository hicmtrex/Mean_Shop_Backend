import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Product from '../models/product';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const pageSize: any = req.query.pageSize || 9;
    const page: any = req.query.page || 1;
    const searchQuery = req.query.query || '';
    const category = req.query.category || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categories = await Product.find({}).distinct('category');
    const categoryFilter = category && category !== 'all' ? { category } : {};

    const products = await Product.find({ ...queryFilter, ...categoryFilter })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .lean();

    const countOffer = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
    });

    if (products) {
      res.status(200).json({
        countOffer,
        products,
        categories,
        page,
        pages: Math.ceil(countOffer / pageSize),
      });
    } else {
      res.status(404).json({ message: 'products not found!' });
    }
  }
);

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const getProductByUd = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found!' });
    }
  }
);

// @desc    Delete User
// @route   Delete /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.status(200).json('product has been deleted');
    } else {
      res.status(404).json({ message: 'Product not found!' });
    }
  }
);

// @desc    Delete User
// @route   Delete /api/products/:id
// @access  Private/Admin
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.create(req.body);

    if (product) {
      res.status(201).json(product);
    } else {
      res.status(400).json({ message: 'Something Went Wrong' });
    }
  }
);

// @desc    Delete User
// @route   Delete /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(400).json({ message: 'Something Went Wrong' });
    }
  }
);
