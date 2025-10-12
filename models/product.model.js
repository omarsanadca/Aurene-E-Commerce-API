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

// TODO: add virtual reviews

export const productModel = mongoose.model("Product", productSchema);
