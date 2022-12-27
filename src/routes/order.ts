import express from 'express';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  orderPayment,
  updateOrder,
} from '../controllers/order';
import { admin, auth } from '../middleware/protecte-routes';

const router = express.Router();

router.route('/').post(auth, createOrder).get(auth, admin, getAllOrders);
router.route('/payment').post(auth, orderPayment);
router.route('/user').get(auth, getUserOrders);
router
  .route('/:id')
  .get(auth, getOrderById)
  .put(auth, updateOrder)
  .delete(auth, deleteOrder);

export default router;
