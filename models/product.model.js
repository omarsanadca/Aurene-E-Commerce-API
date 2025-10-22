import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    soldCount: {
      // auto computed
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ["watch", "bag", "bracelet", "ring"],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    imagePublicId: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// const user= {
//   name: "ali",
//   getName: () => {
//     // this.name; // not allowed
//   },
//   getNameFn: function() {
//     this.name;
//   }
// }

productSchema.virtual("price").get(function () {
  return (this.originalPrice * (100 - this.discount)) / 100;
});

productSchema.virtual("reviews", {
  localField: "_id",
  ref: "Review",
  foreignField: "productId",
});

// productSchema.virtual("stars").get(function () {
//   let sum = 0;

//   if (!this.reviews || this.reviews.length === 0) return 0;

//   for (const review of this.reviews) {
//     sum += review.stars;
//   }

//   if (sum === 0) return sum;

//   const allowedStars = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
//   let stars = sum / this.reviews.length;
//   for (const s of allowedStars) {
//     if (s >= stars) {
//       stars = s;
//       break;
//     }
//   }

//   return stars;
// });

export const productModel = mongoose.model("Product", productSchema);
