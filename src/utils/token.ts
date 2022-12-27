import jwt from 'jsonwebtoken';
import { GenerateTokenData, IUser } from './interfaces/user.interface';

export const getUserData = (user: IUser) => {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    image: user.image,
  };
};

export const generateToken = (data: GenerateTokenData) => {
  const { user, time, key } = data;
  const accessToken = jwt.sign(
    {
      UserInfo: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        image: user.image,
      },
    },
    key || '',
    { expiresIn: time }
  );

  return accessToken;
};
