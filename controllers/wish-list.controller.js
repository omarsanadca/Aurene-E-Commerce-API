import { userModel as User } from "../models/user.model.js";
import { productModel as Product } from "../models/product.model.js";
import NotFoundError from "../Errors/NotFoundError.js";
import ValidationError from "../Errors/ValidationError.js";

export const getMyWishList = async (req, res, next) => {
  try {
    // TODO: populate wishlist then populate reviews

    const { wishList } = await User.findById(req.userId)
      .populate("wishList")
      .select("wishList");
    
    res.json({ message: "Get wishlist", wishList });
  } catch (err) {
    next(err);
  }
};

export const addToWishList = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found!");
    }

    const user = await User.findById(req.userId);

    if (user.wishList.includes(productId)) {
      throw new ValidationError(
        "You've already added this product to your wishlist!"
      );
    }

    user.wishList.push(productId);

    await user.save();

    res.json({ message: "Added product to wishlist!" });
  } catch (err) {
    next(err);
  }
};

export const removeFromWishList = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found!");
    }

    const user = await User.findById(req.userId);

    if (!user.wishList.includes(productId)) {
      throw new ValidationError("This product is not in your wishlist!");
    }

    user.wishList = user.wishList.filter((val) => val.toString() !== productId);

    user.save();

    res.json({ message: "Removed product form wishlist!" });
  } catch (err) {
    next(err);
  }
};
