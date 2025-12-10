import { matchedData } from "express-validator";

import { userModel } from "../models/user.model.js";
import NotFoundError from "../Errors/NotFoundError.js";

export const getUserData = async (req, res, next) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .populate("reviews")
      .select("-password");

    if (!user) {
      throw new NotFoundError("User Not Found!");
    }

    res.json({ message: "Get user data successfully!!!!!!!", user });
  } catch (err) {
    next(err);
  }
};

export const updateUserData = async (req, res, next) => {
  try {
    const userData = matchedData(req);

    const user = userModel.findById(req.userId);

    if (!user) {
      throw new NotFoundError("User Not Found!");
    }

    await user.updateOne(userData);

    res.json({ message: "User data updated successfully!" });
  } catch (err) {
    next(err);
  }
};
