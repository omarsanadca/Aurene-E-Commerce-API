import express from "express";
import {
  cancelMyOrder,
  getMyOrders,
  getOrderById,
  placeAnOrder,
} from "../controllers/orders.controller.js";

const router = express.Router();

router.get("/me", getMyOrders);

router.get("/:orderId", getOrderById);

router.put("/:orderId", cancelMyOrder);

router.post("/", placeAnOrder);

export default router;
