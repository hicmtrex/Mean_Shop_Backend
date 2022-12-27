import express from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductByUd,
  updateProduct,
} from '../controllers/product';

const router = express.Router();

router.route('/').get(getAllProducts).post(createProduct);
router
  .route('/:id')
  .delete(deleteProduct)
  .get(getProductByUd)
  .put(updateProduct);

export default router;
