import { productModel as Product } from "../models/product.model.js";
import { userModel as User } from "../models/user.model.js";
import { orderModel as Order } from "../models/order.model.js";
import UnAuthorizedError from "../Errors/UnAuthorizedError.js";

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json({ message: "Get all orders", orders });
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.userId });
    res.json({ message: "Here are your orders", orders });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["pending", "shipped", "delivered", "canceled"].includes(status)) {
      const err = new Error(
        'Status must be of the following ["pending", "shipped", "delivered", "canceled"]'
      );
      err.status = 400;
      throw err;
    }
    await Order.findByIdAndUpdate(req.params.orderId, {
      $set: { status },
    });

    res.json({ message: "update order status", newStatus: status });
  } catch (err) {
    next(err);
  }
};

// Must be an [role=admin] or [one of my orders]
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (order?.userId?.toString() !== req.userId && req.userRole !== "admin") {
      throw new UnAuthorizedError(
        "You only have access to get your own orders!"
      );
    }
    res.json({ message: "Get order by id", order });
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

    const { deliveryAddress } = req.body;

    const user = await User.findById(req.userId).select("cart"); // [{.........}, {........}]
    const cart = user.cart;

    const promises = cart.items.map(
      async ({ productId, quantity, productPrice }) => {
        const { stock } = await Product.findById(productId).select("stock");

        const newItem = {
          productId,
          productPrice,
          quantity: Math.min(stock, quantity),
        };

        return newItem;
      }
    );

    const newItems = await Promise.all(promises);

    let totalPrice = 0;

    for (const { productPrice, quantity } of newItems) {
      totalPrice += productPrice * quantity;
    }

    const order = await Order.create({
      items: newItems,
      totalPrice,
      status: "pending",
      userId: user._id,
      deliveryAddress,
    });

    async function updateProductData({ productId, quantity }) {
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: -quantity, soldCount: quantity },
      });
    }

    const updateProductPromises = [];

    for (const { productId, quantity } of newItems) {
      updateProductPromises.push(updateProductData({ productId, quantity }));
    }

    await Promise.all(updateProductPromises);

    cart.items = [];
    cart.totalPrice = 0;

    await user.save();

    res.json({ message: "Order DONE", order });
  } catch (err) {
    next(err);
  }
};

export const cancelMyOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (order?.userId?.toString() !== req.userId) {
      throw new UnAuthorizedError(
        "You only have access to get your own orders!"
      );
    }

    if (order.status === "canceled") {
      const err = new Error("The order has been already canceled!");
      err.status = 400;
      throw err;
    }

    if (order.status !== "pending") {
      const err = new Error("Too late, you cannot cancel the order now!");
      err.status = 400;
      throw err;
    }

    order.status = "canceled";

    await order.save();

    res.json({ message: "Canceled the order" });
  } catch (err) {
    next(err);
  }
};
