import express from "express";

import {
  createStore,
  deleteStore,
  getStoreById,
  getStores,
  updateStore,
} from "../controllers/storeController.js";

import {
  authMiddleware,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, adminOnly, createStore)
  .get(authMiddleware, getStores);

router
  .route("/:id")
  .get(authMiddleware, getStoreById)
  .put(authMiddleware, adminOnly, updateStore)
  .delete(authMiddleware, adminOnly, deleteStore);

export default router;