import express from "express";
import { createOrder, getOrders, getOrderById } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrders);
orderRouter.get("/:orderId", getOrderById);

export default orderRouter;