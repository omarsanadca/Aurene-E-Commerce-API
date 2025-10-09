import express from "express";

import {
  signInValidator,
  signUpValidator,
} from "../validators/auth.validators.js";
import { signIn, signUp } from "../controllers/auth.controller.js";
import handleValidationResults from "../utils/handleValidationResults.js";

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

export default router;
