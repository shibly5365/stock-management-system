import asyncHandler from "express-async-handler";
import Product from "../models/product.schema.js";
import Store from "../models/store.schema.js";
import Stock from "../models/stock.model.js";
import mongoose from "mongoose";

export const createStock = asyncHandler(async (req, res) => {
  const { product, store, quantity } = req.body;

  if (!product || !store || quantity === undefined) {
    res.status(400);
    throw new Error("Please provide all required fields.");
  }

  if (quantity < 0) {
    res.status(400);
    throw new Error("Quantity cannot be negative.");
  }

  const productExists = await Product.findById(product);

  if (!productExists) {
    res.status(404);
    throw new Error("Product not found.");
  }

  const storeExists = await Store.findById(store);

  if (!storeExists) {
    res.status(404);
    throw new Error("Store not found.");
  }

  const existingStock = await Stock.findOne({
    product,
    store,
  });

  if (existingStock) {
    res.status(409);
    throw new Error("Stock already exists for this product and store.");
  }

  const stock = await Stock.create({
    product,
    store,
    quantity,
  });

  res.status(201).json({
    success: true,
    message: "Stock created successfully.",
    data: stock,
  });
});

export const getStocks = asyncHandler(async (req, res) => {
  const { threshold } = req.query;

  const filter = {};

  if (threshold !== undefined) {
    filter.quantity = {
      $lte: Number(threshold),
    };
  }

  const stocks = await Stock.find(filter)
    .populate("product", "name sku")
    .populate("store", "name location")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: stocks.length,
    data: stocks,
  });
});

export const getStockById = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.id)
    .populate("product", "name sku")
    .populate("store", "name location");

  if (!stock) {
    res.status(404);
    throw new Error("Stock not found");
  }

  res.status(200).json({
    success: true,
    data: stock,
  });
});

export const updateStock = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const stock = await Stock.findById(req.params.id);

  if (!stock) {
    res.status(404);
    throw new Error("Stock not found");
  }

  if (quantity === undefined) {
    res.status(400);
    throw new Error("Quantity is required");
  }

  if (quantity < 0) {
    res.status(400);
    throw new Error("Quantity cannot be negative");
  }

  stock.quantity = quantity;

  const updatedStock = await stock.save();

  res.status(200).json({
    success: true,
    message: "Stock updated successfully",
    data: updatedStock,
  });
});

export const deleteStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.id);

  if (!stock) {
    res.status(404);
    throw new Error("Stock not found");
  }

  await stock.deleteOne();

  res.status(200).json({
    success: true,
    message: "Stock deleted successfully",
  });
});

export const adjustStock = asyncHandler(async (req, res) => {
  const { productId, storeId, quantity } = req.body;

  if (!productId || !storeId || quantity === undefined) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const stock = await Stock.findOne({
    product: productId,
    store: storeId,
  });

  if (!stock) {
    res.status(404);
    throw new Error("Stock not found");
  }

  const newQuantity = stock.quantity + quantity;

  if (newQuantity < 0) {
    res.status(400);
    throw new Error("Insufficient stock");
  }

  stock.quantity = newQuantity;

  await stock.save();

  res.status(200).json({
    success: true,
    message: "Stock adjusted successfully",
    data: stock,
  });
});

export const transferStock = asyncHandler(async (req, res) => {
  const { productId, fromStore, toStore, quantity } = req.body;

  if (!productId || !fromStore || !toStore || quantity === undefined) {
    res.status(400);
    throw new Error("Please provide all required fields.");
  }

  if (quantity <= 0) {
    res.status(400);
    throw new Error("Transfer quantity must be greater than zero.");
  }

  if (fromStore === toStore) {
    res.status(400);
    throw new Error("Source and destination stores cannot be the same.");
  }

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const sourceStock = await Stock.findOne({
      product: productId,
      store: fromStore,
    }).session(session);

    const destinationStock = await Stock.findOne({
      product: productId,
      store: toStore,
    }).session(session);

    if (!sourceStock) {
      res.status(404);
      throw new Error("Source store stock not found.");
    }

    if (!destinationStock) {
      res.status(404);
      throw new Error("Destination store stock not found.");
    }

    const updatedSourceStock = await Stock.findOneAndUpdate(
      {
        product: productId,
        store: fromStore,
        quantity: { $gte: quantity },
      },
      {
        $inc: {
          quantity: -quantity,
        },
      },
      {
        session,
        new: true,
      },
    );

    if (!updatedSourceStock) {
      res.status(400);
      throw new Error("Insufficient stock.");
    }

    await Stock.findOneAndUpdate(
      {
        product: productId,
        store: toStore,
      },
      {
        $inc: {
          quantity: quantity,
        },
      },
      {
        session,
        new: true,
      },
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Stock transferred successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});
