import { matchedData } from "express-validator";

import { userModel } from "../models/user.model.js";
import NotFoundError from "../Errors/NotFoundError.js";
import ValidationError from "../Errors/ValidationError.js";

export const makeAdmin = async (req, res, next) => {
  try {
    const { userId } = matchedData(req);

    const user = await userModel.findById(userId);

    if (!user) {
      throw new NotFoundError("User Not Found!");
    }

    if (user.role === "admin") {
      throw new ValidationError("User is already an admin!");
    }

    user.role = "admin";

    await user.save();

    res.json({ message: "User has been successfully an admin!" });
  } catch (err) {
    next(err);
  }
};
