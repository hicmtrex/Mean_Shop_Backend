import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import User from '../models/user';

// @desc    get all users
// @route   Get /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const pageSize: any = req.query.pageSize || 9;
  const page: any = req.query.page || 1;
  const searchQuery = req.query.query || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          username: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};

  const users = await User.find({ ...queryFilter })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean()
    .select('-password');

  const countUser = await User.countDocuments({
    ...queryFilter,
  });

  if (users) {
    res.status(200).json({
      countUser,
      users,
      page,
      pages: Math.ceil(countUser / pageSize),
    });
  } else {
    res.status(404).json({ message: 'users not found!' });
  }
});

// @desc    get all users
// @route   Get /api/users/:id
// @access  Private
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'user not found!' });
  }
});

// @desc    Delete user
// @route   Delete /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.status(200).json('user has been deleted');
  } else {
    res.status(404).json({ message: 'user not found!' });
  }
});

// @desc    Update user
// @route   Put /api/users/:id
// @access  Private
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = username;
    user.email = email;
    if (password) user.password = password;
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } else {
    res.status(404).json({ message: 'user not found!' });
  }
});
