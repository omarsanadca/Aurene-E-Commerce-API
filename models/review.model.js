import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  stars: {
    type: Number,
    enum: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

export const reviewModel = mongoose.model("Review", reviewSchema);
