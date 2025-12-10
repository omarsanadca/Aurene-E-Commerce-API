import { body } from "express-validator";
import bcrypt from "bcryptjs";

import { userModel as User } from "../models/user.model.js";

export const signUpValidator = [
  body("firstName")
    .isLength({ min: 3 })
    .withMessage("fist name must be at least 3 characters"),
  body("lastName")
    .isLength({ min: 3 })
    .withMessage("last name must be at least 3 characters"),
  body("email")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("User with this email already exists");
      }
      return true;
    }),
  body("userName")
    .isLength({ min: 3 })
    .withMessage("username must be at least 3 characters")
    .custom(async (val) => {
      const user = await User.findOne({ userName: val });
      if (user) {
        throw new Error("User with this username already exists");
      }
      return true;
    }),
  body("phoneNumber")
    .isMobilePhone("ar-EG")
    .withMessage("Invalid mobile number"),
  body("password").isStrongPassword(),
  body("confirmPassword").custom((val, { req }) => {
    if (val !== req.body.password) {
      throw new Error("Passwords don't match");
    }
    return true;
  }),
  body("region").notEmpty().withMessage("region is required"),
  body("location").optional(),
];

export const signInValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty(),
];

export const forgetPasswordValidator = [
  body("email").isEmail().withMessage("Invalid email"),
];

export const resetPasswordValidator = [body("newPassword").isStrongPassword()];

/*

  123
  Secret@1 -- is weak

*/

export const updatePasswordValidator = [
  body("password").custom(async (val, { req }) => {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error("User NOT FOUND");
    }

    const doMatch = await bcrypt.compare(val, user.password);

    if (!doMatch) {
      throw new Error("Incorrect Password");
    }

    return true;
  }),
  body("newPassword").isStrongPassword(),
  body("confirmPassword").custom((val, { req }) => {
    if (val !== req.body.newPassword) {
      throw new Error("Passwords don't match");
    }
    return true;
  }),
];
