import { matchedData } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { userModel as User } from "../models/user.model.js";

export const signUp = async (req, res, next) => {
  try {
    const user = new User(matchedData(req));

    user.password = await bcrypt.hash(user.password, 10);

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ message: "SignUp Successfully", user: userObj });
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("Invalid Credentials");
      err.status = 400;
      throw err;
    }

    const doMatch = await bcrypt.compare(password, user.password);

    if (!doMatch) {
      const err = new Error("Invalid Credentials");
      err.status = 400;
      throw err;
    }

    jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) {
          return next(err);
        }

        res.json({ message: "Login Successfully!", token });
      }
    );
  } catch (err) {
    next(err);
  }
};
