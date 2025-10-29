import express from "express";

import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import usersRoutes from "./users.routes.js";
import productsRoutes from "./products.routes.js";
import reviewsRoutes from "./reviews.routes.js";
import wishListRoutes from "./wish-list.routes.js";
import cartRoutes from "./card.routes.js";
import ordersRoutes from "./orders.routes.js";

import isAuthenticated from "../middlewares/is-authenticated.js";
import isAdmin from "../middlewares/is-admin.js";

const router = express.Router();

router.use("/admin", isAuthenticated, isAdmin, adminRoutes);
router.use("/auth", authRoutes);
router.use("/users", isAuthenticated, usersRoutes);
router.use("/products", productsRoutes);
router.use("/reviews", isAuthenticated, reviewsRoutes);
router.use("/wish-list", isAuthenticated, wishListRoutes);
router.use("/cart", isAuthenticated, cartRoutes);
router.use("/orders", isAuthenticated, ordersRoutes);

export default router;
