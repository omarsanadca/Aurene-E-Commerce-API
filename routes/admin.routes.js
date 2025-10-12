import express from "express";

import { makeAdminValidator } from "../validators/admin.validators.js";
import { makeAdmin } from "../controllers/admin.controller.js";
import handleValidationResults from "../utils/handleValidationResults.js";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/products.controller.js";
import {
  addProductValidator,
  updateProductValidator,
  validateProductId,
} from "../validators/products.validators.js";

const router = express.Router();

/* Make admin */

router.post(
  "/make-admin",
  makeAdminValidator,
  handleValidationResults("Making admin failed"),
  makeAdmin
);

/* Manage Products */

router.post(
  "/products/",
  addProductValidator,
  handleValidationResults("adding product failed!"),
  addProduct
);

router.patch(
  "/products/:id",
  updateProductValidator,
  handleValidationResults("updating product failed!"),
  updateProduct
);

router.delete(
  "/products/:id",
  validateProductId,
  handleValidationResults("Deleting product failed!"),
  deleteProduct
);

export default router;
