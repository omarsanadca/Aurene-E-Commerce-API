import crypto from "crypto";

import { matchedData } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { userModel as User } from "../models/user.model.js";
import { sendResetPasswordEmail } from "../utils/sendingEmails.js";

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

export const updatePassword = async (req, res, next) => {
  try {
    const { newPassword } = matchedData(req);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findById(req.userId);

    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Updated password successfully!" });
  } catch (err) {
    next(err);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      console.log("User exists");

      const rawToken = crypto.randomBytes(32).toString("hex");

      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      const tokenExpiration = Date.now() + 1000 * 60 * 15; // 15 minutes

      user.resetPasswordToken = hashedToken;
      user.resetPasswordTokenExpiration = tokenExpiration;
      await user.save();

      await sendResetPasswordEmail(email, rawToken);
    }
    res.json({ message: "If this email exists, a reset link was sent" });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiration: {
        $gte: Date.now(),
      },
    });

    if (!user) {
      const err = new Error("Invalid or expired token!");
      err.status = 400;
      throw err;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await user.updateOne({
      $unset: { resetPasswordToken: "", resetPasswordTokenExpiration: "" },
    });

    res.json({ message: "resetting password DONE!" });
  } catch (err) {
    next(err);
  }
};
