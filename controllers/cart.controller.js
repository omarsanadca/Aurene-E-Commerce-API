import NotFoundError from "../Errors/NotFoundError.js";
import { productModel as Product } from "../models/product.model.js";
import { userModel as User } from "../models/user.model.js";

export const getMyCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("cart.items.productId")
      .select("cart");
    const cart = user.cart;
    res.json({ message: "Get your cart!", cart });
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError("product Not Found!");
    }

    const user = await User.findById(req.userId).select("cart");
    const cart = user.cart;

    const productItem = cart.items.find(
      (p) => p.productId.toString() === productId
    );

    if (productItem) {
      productItem.quantity++;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    cart.totalPrice += product.price;

    await user.save();

    res.json({ message: "add to cart!", cart });
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError("product Not Found!");
    }

    const user = await User.findById(req.userId).select("cart");
    const cart = user.cart;

    const productItemIndex = cart.items.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productItemIndex === -1) {
      throw new Error("This is item is not the cart!");
    }

    cart.items[productItemIndex].quantity--;

    cart.totalPrice -= product.price;

    if (cart.items[productItemIndex].quantity === 0) {
      cart.items.splice(productItemIndex);
    }

    await user.save();

    res.json({ message: "removed product from cart!", cart });
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("cart.items.productId")
      .select("cart");
    const cart = user.cart;

    cart.items = [];
    cart.totalPrice = 0;

    await user.save();

    res.json({ message: "Cleared your cart!" });
  } catch (err) {
    next(err);
  }
};
