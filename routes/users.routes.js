import express from "express";

import isAuthenticated from "../middlewares/is-authenticated.js";
import { updateUserDataValidator } from "../validators/user.validators.js";
import handleValidationResults from "../utils/handleValidationResults.js";
import {
  getUserData,
  updateUserData,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/me", getUserData);

router.patch(
  "/me",
  updateUserDataValidator,
  handleValidationResults("Update User Data Failed!"),
  updateUserData
);

export default router;
