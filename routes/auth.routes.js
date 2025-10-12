import express from "express";

import {
  signInValidator,
  signUpValidator,
  updatePasswordValidator,
} from "../validators/auth.validators.js";
import { signIn, signUp, updatePassword } from "../controllers/auth.controller.js";
import handleValidationResults from "../utils/handleValidationResults.js";
import isAuthenticated from "../middlewares/is-authenticated.js";

const router = express.Router();

router.post(
  "/sign-up",
  signUpValidator,
  handleValidationResults("SignUp Failed"),
  signUp
);

router.post(
  "/sign-in",
  signInValidator,
  handleValidationResults("SignUp Failed"),
  signIn
);

router.post(
  "/update-password",
  isAuthenticated,
  updatePasswordValidator,
  handleValidationResults("updating password failed!"),
  updatePassword
);

export default router;
