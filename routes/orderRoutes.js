import {Router} from 'express';
import {roles} from '../middleware/rolesware.js';
import { authcheck } from '../middleware/authware.js';
import { createOrderAuth , getOrdersAuth , addOrder , getOrders , updateOrder , deleteOrder } from '../controllers/orderController.js';

const router = Router();
router.route('/').get(authcheck,roles('store-owner'),getOrdersAuth).post(authcheck,roles('store-owner'),createOrderAuth);
router.route('/dev').get(authcheck,roles('admin'),getOrders).post(authcheck,roles('admin'),addOrder);
router.route('/:id').put(authcheck,roles('store-owner'),updateOrder).delete(authcheck,roles('store-owner'),deleteOrder);

export default router;