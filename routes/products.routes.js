import express from "express";

import {
  getAllProducts,
  getProductById,
} from "../controllers/products.controller.js";
import { validateProductId } from "../validators/products.validators.js";
import handleValidationResults from "../utils/handleValidationResults.js";

const router = express.Router();

router.get("", getAllProducts);

router.get(
  "/:id",
  validateProductId,
  handleValidationResults("Getting product by id failed"),
  getProductById
);

export default router;
