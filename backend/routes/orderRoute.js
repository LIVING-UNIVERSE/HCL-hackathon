import express from 'express';
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, cancelOrder } from '../controllers/orderController.js';
import authUser from '../middlewares/authUser.js';

const orderRouter = express.Router();

// User routes
orderRouter.post("/place", authUser, placeOrder);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.put("/cancel/:orderId", authUser, cancelOrder);

// Admin routes (add admin middleware later if needed)
orderRouter.get("/list", getAllOrders);
orderRouter.put("/status", updateOrderStatus);

export default orderRouter;
