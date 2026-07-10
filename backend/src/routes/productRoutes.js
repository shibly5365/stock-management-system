import express from "express";

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";

import {
  authMiddleware,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, adminOnly, createProduct)
  .get(authMiddleware, getProducts);

router
  .route("/:id")
  .get(authMiddleware, getProductById)
  .put(authMiddleware, adminOnly, updateProduct)
  .delete(authMiddleware, adminOnly, deleteProduct);

export default router;