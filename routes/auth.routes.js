import express from "express";

import {
  forgetPasswordValidator,
  resetPasswordValidator,
  signInValidator,
  signUpValidator,
  updatePasswordValidator,
} from "../validators/auth.validators.js";

import {
  forgetPassword,
  resetPassword,
  signIn,
  signUp,
  updatePassword,
} from "../controllers/auth.controller.js";

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

router.post(
  "/forget-password",
  forgetPasswordValidator,
  handleValidationResults("Request reset password failed!"),
  forgetPassword
);

router.post(
  "/reset-password/:token",
  resetPasswordValidator,
  handleValidationResults("Resetting password failed!"),
  resetPassword
);

export default router;
