import { body } from "express-validator";

import { userModel as User } from "../models/user.model.js";

export const updateUserDataValidator = [
  body("firstName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("fist name must be at least 3 characters"),
  body("lastName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("last name must be at least 3 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user && user._id !== req.userId) {
        throw new Error("User with this email already exists");
      }
      return true;
    }),
  body("userName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("username must be at least 3 characters")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ userName: val });
      if (user && user._id !== req.userId) {
        throw new Error("User with this username already exists");
      }
      return true;
    }),
  body("phoneNumber")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid mobile number"),
  body("region").optional(),
  body("location").optional(),
];
