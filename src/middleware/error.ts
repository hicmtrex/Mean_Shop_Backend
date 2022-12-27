import { Request, Response, ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
