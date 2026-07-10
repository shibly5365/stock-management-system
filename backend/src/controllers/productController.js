import asyncHandler from "express-async-handler";
import Product from "../models/product.schema.js";

export const createProduct = asyncHandler(async (req, res) => {
  const { name, sku } = req.body;
  if (!name || !sku) {
    res.status(400);
    throw new Error("pleace fill the feilds");
  }
  const existingProduct = await Product.findOne({ sku });
  if (existingProduct) {
    res.status(409);
    throw new Error("SKU already exists");
  }

  const product = await Product.create({
    name,
    sku,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { name, sku } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (sku && sku !== product.sku) {
    const existingProduct = await Product.findOne({
      sku,
      _id: { $ne: req.params.id },
    });

    if (existingProduct) {
      res.status(409);
      throw new Error("SKU already exists");
    }

    product.sku = sku;
  }

  if (name) {
    product.name = name;
  }
  const updatedProduct = await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
