import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const validation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), message: 'invalid input!' });
  } else {
    return next();
  }
};

export default validation;
