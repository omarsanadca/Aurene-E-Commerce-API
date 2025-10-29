import express from "express";

import {
  addReview,
  deleteReview,
  editReview,
  // getAllReviews,
} from "../controllers/reviews.controller.js";
import {
  addReviewValidator,
  editReviewValidator,
} from "../validators/reviews.validator.js";
import handleValidationResults from "../utils/handleValidationResults.js";

const router = express.Router();

// router.get("", getAllReviews);

// router.get("/:productId", () => {});

router.post(
  "",
  addReviewValidator,
  handleValidationResults("adding review failed!"),
  addReview
);

router.patch(
  "/:reviewId",
  editReviewValidator,
  handleValidationResults("editing review failed!"),
  editReview
);

router.delete("/:reviewId", deleteReview);

export default router;
