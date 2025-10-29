import { matchedData } from "express-validator";

import { productModel as Product } from "../models/product.model.js";
import { userModel as User } from "../models/user.model.js";
import NotFoundError from "../Errors/NotFoundError.js";
import { reviewModel as Review } from "../models/review.model.js";
import ValidationError from "../Errors/ValidationError.js";

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.json({ message: "Get all reviews!", reviews });
  } catch (err) {
    next(err);
  }
};

export const getMyReview = async (req, res, next) => {
  try {
    const review = await Review.find({
      productId: req.params.productId,
      userId: req.userId,
    });

    res.json({ message: "Get your review on this product!", review });
  } catch (err) {
    next(err);
  }
};

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
      throw new ValidationError(
        `You have already added a review for this product, reviewId: ${findReview._id}`
      );
    }

    const review = await Review.create({
      stars,
      comment,
      productId,
      userId: req.userId,
    });

    // product.stars, product.reviewsCount

    /*
      stars = 3.5
      reviewsCount = 2

      add (4)

      tot/cnt

      (3.5 * 2 + 4) / 3
    */

    product.stars =
      (product.stars * product.reviewsCount + stars) /
      (product.reviewsCount + 1);

    product.reviewsCount = product.reviewsCount + 1;

    await product.save();

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

    const product = await Product.findById(review.productId);

    product.stars =
      (product.stars * product.reviewsCount - review.stars) /
      (product.reviewsCount - 1);
    product.reviewsCount = product.reviewsCount - 1;

    product.stars =
      (product.stars * product.reviewsCount + stars) /
      (product.reviewsCount + 1);

    product.reviewsCount = product.reviewsCount + 1;

    await product.save();

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
      throw new Error("You can only delete your own reviews, not others");
    }

    /* 
      {4.5, 3.5, 4} => 12 / 3 = 4

      product.stars = 4;
      product.reviewsCount = 3

      (3 * 4 - 3.5) / 2 = 7.5 / 2 = 3.75
    */

    const product = await Product.findById(review.productId);

    product.stars =
      (product.stars * product.reviewsCount - review.stars) /
      (product.reviewsCount - 1);
    product.reviewsCount = product.reviewsCount - 1;

    await product.save();
    await review.deleteOne();

    res.json({ message: "deleted review!" });
  } catch (err) {
    next(err);
  }
};
