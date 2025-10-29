import express from "express";

import {
  addToCart,
  clearCart,
  getMyCart,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/me", getMyCart);

router.patch("/add/", addToCart);

router.patch("/remove/", removeFromCart);

router.delete("/clear", clearCart);

export default router;
