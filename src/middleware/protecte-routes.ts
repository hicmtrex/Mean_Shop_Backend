import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { DataStoredInToken } from '../utils/interfaces/user.interface';
import { NextFunction, Response } from 'express';

// only user logged user have access
export const auth = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
      const token = authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || ''
      ) as DataStoredInToken;

      if (decoded) {
        req.user = decoded.UserInfo;
        next();
      } else {
        res.status(401).json({ message: 'Not authorized no token' });
      }
    } else {
      res.status(401).json({ message: 'Not authorized no token' });
    }
  }
);

// only user within admin role have access
export const admin = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401).json({ message: 'Not Admin' });
    }
  }
);
