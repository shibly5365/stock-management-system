import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { adminOnly, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});
router.get("/admin", authMiddleware, adminOnly, (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
  });
});

export default router;
