import { productModel as Product } from "../models/product.model.js";
import { userModel as User } from "../models/user.model.js";

export const getAllOrders = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

// Must be an [role=admin] or [one of my orders]
export const getOrderById = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

export const placeAnOrder = async (req, res, next) => {
  try {
    /*
    -- 1. check if there are enough in the stock (validate the cart)
    -- 2. minus the quantity of each product in the cart (stock -= product.quantity)
    -- 3. req.body -> del_location
    -- 4. payment (NOT NOW)
    -- 5. download recite or receive it on mail
    */

    const user = await User.findById(req.userId).select("cart");
    const cart = user.cart;

    console.log(cart.items);

    // [23242, 20] -> 50

    const promises = cart.items.map(async ({ productId, quantity }) => {
      const { stock } = await Product.findById(productId).select("stock");

      const newItem = {
        productId,
        quantity: Math.min(stock, quantity),
      };

      return newItem;
    });

    const newItems = await Promise.all(promises);

    let totalPrice = 0;

    newItems.reduce(({ productId, quantity }, currTot) => {}, 0);

    const promise = newItems.forEach(async ({ productId, quantity }) => {
      const { price } = await Product.findById(productId).select("price");
      totalPrice += price * quantity;
    });

    res.json({ message: "test Promise.all", newItems });
  } catch (err) {
    next(err);
  }
};
