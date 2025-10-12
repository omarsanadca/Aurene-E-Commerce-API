import { body } from "express-validator";
import mongoose from "mongoose";

export const addReviewValidator = [
  body("stars")
    .isFloat({ min: 0, max: 5 })
    .custom((val) => {
      const allowedStars = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
      if (!allowedStars.includes(val)) {
        throw new Error(
          `stars must be one of [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]`
        );
      }

      return true;
    }),
  body("comment")
    .isLength({ min: 3 })
    .withMessage("comment must be at least 3 characters!"),

  body("productId").custom((val) => {
    if (!mongoose.Types.ObjectId.isValid(val)) {
      throw new Error("Invalid product id");
    }

    return true;
  }),
];

export const editReviewValidator = [
  body("stars")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .custom((val) => {
      const allowedStars = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
      if (!allowedStars.includes(val)) {
        throw new Error(
          `stars must be one of [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]`
        );
      }

      return true;
    }),

  body("comment")
    .optional()
    .isLength({ min: 3 })
    .withMessage("comment must be at least 3 characters!"),
];
