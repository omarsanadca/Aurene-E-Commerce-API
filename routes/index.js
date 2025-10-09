import express from "express";

import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import usersRoutes from "./users.routes.js";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
// router.use("/products");
// router.use("/wish-list");
// router.use("/cart");
// router.use("/orders");

export default router;
