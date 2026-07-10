import express from "express";

import {
  createStock,
  getStocks,
  getStockById,
  updateStock,
  deleteStock,
  adjustStock,
  transferStock,
} from "../controllers/stockController.js";

import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, adminOnly, createStock)
  .get(authMiddleware, getStocks);

router.patch("/adjust", authMiddleware, adminOnly, adjustStock);

router.post("/transfer", authMiddleware, adminOnly, transferStock);

router
  .route("/:id")
  .get(authMiddleware, getStockById)
  .put(authMiddleware, adminOnly, updateStock)
  .delete(authMiddleware, adminOnly, deleteStock);

export default router;
