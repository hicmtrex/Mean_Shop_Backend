import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken, getUserData } from '../utils/token';
import { DataStoredInToken } from '../utils/interfaces/user.interface';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const userRegister = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, address, password } = req.body;

    const exist = await User.findOne({ email });

    if (exist) {
      res.status(422).json({ message: 'email already used!' });
      return;
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      const tokenData = {
        user: getUserData(user),
        key: process.env.ACCESS_TOKEN_SECRET || '',
        time: '2h',
      };

      const refreshData = {
        user: getUserData(user),
        key: process.env.REFRESH_TOKEN_SECRET || '',
        time: '2d',
      };

      const accessToken = generateToken(tokenData);

      const refreshToken = generateToken(refreshData);

      res.cookie('token', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https,
        sameSite: 'none', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
      });

      res.status(201).json({ token: accessToken });
    }
  }
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: 'Email not exist' });
    return;
  }

  const match = await bcrypt.compare(password, user.password);

  if (match) {
    const tokenData = {
      user: getUserData(user),
      key: process.env.ACCESS_TOKEN_SECRET || '',
      time: '2h',
    };

    const refreshData = {
      user: getUserData(user),
      key: process.env.REFRESH_TOKEN_SECRET || '',
      time: '2d',
    };

    const accessToken = generateToken(tokenData);

    const refreshToken = generateToken(refreshData);

    res.cookie('token', refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https,
      sameSite: 'none', //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    res.status(200).json({ token: accessToken });
  } else {
    res.status(401).json({ message: ' wrong email or password' });
    return;
  }
});

// @desc    refresh user token
// @route   POST /api/auth/refresh-token
// @access  Private/Cookies
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies.token) {
      res.status(401).json({ message: 'Unauthorized no token!' });
      return;
    }
    const refreshToken = cookies.token;

    const decode = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || ''
    ) as DataStoredInToken;

    const tokenData = {
      user: decode.UserInfo,
      key: process.env.ACCESS_TOKEN_SECRET || '',
      time: '2h',
    };

    const accessToken = generateToken(tokenData);

    res.status(200).json({
      token: accessToken,
    });
  }
);
