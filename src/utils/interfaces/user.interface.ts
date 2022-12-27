import { Request } from 'express';

export interface IUser {
  _id: string;
  username: string;
  email: string;
  image: string;
  isAdmin: boolean;
}

export interface RequestWithUser extends Request {
  user: IUser;
}

export interface DataStoredInToken {
  UserInfo: IUser;
}

export interface GenerateTokenData {
  user: IUser;
  time: string;
  key: string;
}
