import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

const loginLimiter = rateLimit({
  windowMs: 3000 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login requests per `window` per minute
  message: {
    message:
      'Too many login attempts from this IP, please try again after 5min',
  },
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default loginLimiter;
