import { matchedData } from "express-validator";

import NotFoundError from "../Errors/NotFoundError.js";
import { productModel as Product } from "../models/product.model.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({ message: "get products!", products });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new NotFoundError("Product Not Found");
    }

    res.json({ message: "Get product!", product });
  } catch (err) {
    next(err);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const productData = matchedData(req);

    const product = await Product.create(productData);

    res.status(201).json({ message: "added product successfully!", product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new NotFoundError("Product Not Found!");
    }

    const productData = matchedData(req);

    await product.updateOne(productData);

    res.json({ message: "updated product successfully!" });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError("Product Not Found!");
    }

    await product.deleteOne();

    res.json({ message: "deleted product successfully!" });
  } catch (err) {
    next(err);
  }
};
