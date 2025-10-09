import { body } from "express-validator";
import mongoose from "mongoose";

export const makeAdminValidator = [
  body("userId").custom((val) => {
    if (!mongoose.Types.ObjectId.isValid(val)) {
      throw new Error("Invalid User Id");
    }

    return true;
  }),
];
