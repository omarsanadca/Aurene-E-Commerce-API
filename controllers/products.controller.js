import { Readable } from "stream";

import { matchedData } from "express-validator";

import cloudinary from "../config/cloudinary.js";

import NotFoundError from "../Errors/NotFoundError.js";
import { productModel as Product } from "../models/product.model.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const {
      sort,
      category,
      priceMin,
      priceMax,
      color,
      material,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (color) query.color = color;
    if (material) query.material = material;

    if (priceMin || priceMax) {
      // [500-1000] -> p >= 500 && p <= 1000
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    let productsQuery = Product.find(query);

    if (sort) {
      const sortOptions = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        priceAsc: { price: 1 },
        priceDesc: { price: -1 },
        popular: { soldCount: -1 },
      };

      productsQuery = productsQuery.sort(sortOptions[sort] || {});
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    const totalProducts = await productsQuery.clone().countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    productsQuery = productsQuery.skip((page - 1) * limit).limit(limit);

    // productsQuery = productsQuery.populate("reviews");

    productsQuery = productsQuery.select(
      "title price originalPrice discount stars reviewsCount imageUrl"
    );

    const products = await productsQuery;

    res.json({
      message: "get products!",
      totalProducts,
      totalPages,
      numberOfProducts: products.length,
      page,
      isFirstPage: +page === 1,
      isLastPage: +page === totalPages,
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews");
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

    const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      async (cbError, result) => {
        try {
          if (cbError) throw cbError;

          const { public_id, secure_url } = result;

          productData.imagePublicId = public_id;
          productData.imageUrl = secure_url;

          const product = await Product.create(productData);

          res
            .status(201)
            .json({ message: "added product successfully!", product });
        } catch (err) {
          next(err);
        }
      }
    );

    const fileStream = Readable.from(req.file.buffer);

    fileStream.pipe(cloudinaryUploadStream);
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

    if (!req.file) {
      await product.updateOne(productData);

      return res.json({ message: "updated product successfully!" });
    }

    const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
      { folder: "products", public_id: product.imagePublicId },
      async (cbError) => {
        try {
          if (cbError) throw cbError;

          await product.updateOne(productData);

          res.json({ message: "updated product successfully!" });
        } catch (err) {
          next(err);
        }
      }
    );

    const fileStream = Readable.from(req.file.buffer);

    fileStream.pipe(cloudinaryUploadStream);
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

    const imagePublicId = product.imagePublicId;

    await cloudinary.uploader.destroy(imagePublicId, {
      invalidate: true,
    });

    await product.deleteOne();

    res.json({ message: "deleted product successfully!" });
  } catch (err) {
    next(err);
  }
};
