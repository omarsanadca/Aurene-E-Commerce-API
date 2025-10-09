import express from "express";

import isAuthenticated from "../middlewares/is-authenticated.js";
import isAdmin from "../middlewares/is-admin.js";
import { makeAdminValidator } from "../validators/admin.validators.js";
import { makeAdmin } from "../controllers/admin.controller.js";
import handleValidationResults from "../utils/handleValidationResults.js";

const router = express.Router();

router.post(
  "/make-admin",
  isAuthenticated,
  isAdmin,
  makeAdminValidator,
  handleValidationResults("Making admin failed"),
  makeAdmin
);

export default router;
