import express from "express";

import {
  addToWishList,
  getMyWishList,
  removeFromWishList,
} from "../controllers/wish-list.controller.js";

const router = express.Router();

router.get("/me", getMyWishList);

router.patch("/add/", addToWishList);

router.patch("/remove/", removeFromWishList);

export default router;
