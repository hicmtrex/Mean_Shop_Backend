import express from 'express';
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../controllers/user';
import { admin, auth } from '../middleware/protecte-routes';

const router = express.Router();

router.route('/').get(auth, admin, getAllUsers);
router
  .route('/:id')
  .delete(auth, admin, deleteUser)
  .put(auth, updateUser)
  .get(auth, getUserById);

export default router;
