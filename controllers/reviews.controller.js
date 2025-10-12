import { matchedData } from "express-validator";

import { productModel as Product } from "../models/product.model.js";
import { userModel as User } from "../models/user.model.js";
import NotFoundError from "../Errors/NotFoundError.js";
import { reviewModel as Review } from "../models/review.model.js";

export const addReview = async (req, res, next) => {
  try {
    const { stars, comment, productId } = matchedData(req);

    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found!");
    }

    const user = await User.findById(req.userId);

    if (!user) {
      throw new NotFoundError("User Not Found!");
    }

    const findReview = await Review.findOne({ productId, userId: req.userId });

    if (findReview) {
      throw new Error(
        `You have already added a review for this product, reviewId: ${findReview._id}`
      );
    }

    const review = await Review.create({
      stars,
      comment,
      productId,
      userId: req.userId,
    });

    res.json({ message: "added review", review });
  } catch (err) {
    next(err);
  }
};

export const editReview = async (req, res, next) => {
  try {
    const { stars, comment } = matchedData(req);

    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      throw new NotFoundError("Review not found!");
    }

    if (req.userId.toString() !== review.userId.toString()) {
      throw new Error("You can only edit your own reviews, not others");
    }

    await review.updateOne({ stars, comment });

    res.json({ message: "Review updated successfully!" });
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      throw new Error("Review not found!");
    }

    if (req.userId.toString() !== review.userId.toString()) {
      throw new Error("You can only edit your own reviews, not others");
    }

    await review.deleteOne();

    res.json({ message: "deleted review!" });
  } catch (err) {
    next(err);
  }
};
