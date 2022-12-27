import express from 'express';
import { refreshToken, userLogin, userRegister } from '../controllers/auth';
import loginLimiter from '../middleware/limite-loger';
import validation from '../middleware/validation';
import { loginSchema, registerSchema } from '../utils/validation/user';

const router = express.Router();

router
  .route('/')
  .post(registerSchema, validation, userRegister)
  .get(refreshToken);
router.route('/login').post(loginSchema, validation, loginLimiter, userLogin);

export default router;
