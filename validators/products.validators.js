import { body, param } from "express-validator";
import mongoose from "mongoose";

export const validateProductId = [
  param("id").custom((val) => {
    if (!mongoose.Types.ObjectId.isValid(val)) {
      throw new Error("Invalid product id");
    }
    return true;
  }),
];

export const addProductValidator = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("product title must be at least 3 characters"),
  body("description")
    .isLength({ min: 3 })
    .withMessage("product title must be at least 3 characters"),
  body("originalPrice")
    .isFloat({ min: 1, max: 10000 })
    .withMessage("product price must be at least 1 and at most 10'000"),
  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("discount must be at least 0 and at most 100"),
  body("category")
    .isString()
    .custom((val) => {
      const allowedCat = ["watch", "bag", "bracelet", "ring"];
      if (!allowedCat.includes(val)) {
        throw new Error(
          `category must be one of ["watch", "bag", "bracelet", "ring"]`
        );
      }
      return true;
    }),
  body("color")
    .isLength({ min: 3 })
    .withMessage("product color must be at least 3 characters"),
  body("material")
    .isLength({ min: 3 })
    .withMessage("product material must be at least 3 characters"),
  body("stock")
    .isInt({ min: 0, max: 10000 })
    .withMessage("product stock must be at least 1 and at most 10'000"),
];

export const updateProductValidator = [
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("product title must be at least 3 characters"),
  body("description")
    .optional()
    .isLength({ min: 3 })
    .withMessage("product title must be at least 3 characters"),
  body("originalPrice")
    .optional()
    .isFloat({ min: 1, max: 10000 })
    .withMessage("product price must be at least 1 and at most 10'000"),
  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("discount must be at least 0 and at most 100"),
  body("category")
    .optional()
    .isString()
    .custom((val) => {
      const allowedCat = ["watch", "bag", "bracelet", "ring"];
      if (!allowedCat.includes(val)) {
        throw new Error(
          `category must be one of ["watch", "bag", "bracelet", "ring"]`
        );
      }
      return true;
    }),
  body("color")
    .optional()
    .isLength({ min: 3 })
    .withMessage("product color must be at least 3 characters"),
  body("material")
    .optional()
    .isLength({ min: 3 })
    .withMessage("product material must be at least 3 characters"),
  body("stock")
    .optional()
    .isInt({ min: 0, max: 10000 })
    .withMessage("product stock must be at least 1 and at most 10'000"),
];

// export const addProductValidator = [];

// export const addProductValidator = [];
