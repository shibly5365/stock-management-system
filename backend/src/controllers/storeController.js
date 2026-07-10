import asyncHandler from "express-async-handler";
import Store from "../models/store.schema.js";

export const createStore = asyncHandler(async (req, res) => {
  const { name, location } = req.body;
  if (!name || !location) {
    res.status(400);
    throw new Error("pleace fill all the fields");
  }
  const existingStore = await Store.findOne({ name });
  if (existingStore) {
    res.status(409);
    throw new Error("store alredy exists");
  }
  const createStore = await Store.create({
    name,
    location,
  });
  res.status(201).json({
    success: true,
    message: "Store created successfully.",
    data: createStore,
  });
});

export const getStores = asyncHandler(async (req, res) => {
  const stores = await Store.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: stores.length,
    data: stores,
  });
});

export const getStoreById = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);

  if (!store) {
    res.status(404);
    throw new Error("Store not found.");
  }

  res.status(200).json({
    success: true,
    data: store,
  });
});

export const updateStore = asyncHandler(async (req, res) => {
  const { name, location } = req.body;

  const store = await Store.findById(req.params.id);

  if (!store) {
    res.status(404);
    throw new Error("Store not found");
  }

  if (name) {
    const existingStore = await Store.findOne({
      name,
      _id: { $ne: req.params.id },
    });

    if (existingStore) {
      res.status(409);
      throw new Error("Store name already exists");
    }

    store.name = name;
  }

  if (location) {
    store.location = location;
  }

  const updatedStore = await store.save();

  res.status(200).json({
    success: true,
    message: "Store updated successfully",
    data: updatedStore,
  });
});

export const deleteStore = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);

  if (!store) {
    res.status(404);
    throw new Error("Store not found.");
  }

  await store.deleteOne();

  res.status(200).json({
    success: true,
    message: "Store deleted successfully.",
  });
});
