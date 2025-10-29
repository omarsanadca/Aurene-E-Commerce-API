import express from "express";
import {
  getMyOrders,
  getOrderById,
  placeAnOrder,
} from "../controllers/orders.controller.js";

const router = express.Router();

router.get("/me", getMyOrders);

router.get("/:orderId", getOrderById);

router.post("/", placeAnOrder);

export default router;
