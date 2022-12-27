import express from 'express';
import authRoutes from './auth';
import productsRoutes from './product';
import ordersRoutes from './order';
import usersRoutes from './user';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/users', usersRoutes);

export default router;
