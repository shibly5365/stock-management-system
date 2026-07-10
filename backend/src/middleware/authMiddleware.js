import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Users from "../models/user.model.js";

export const authMiddleware = asyncHandler(async (req, res ,next) => {
  const token = req.cookies.token;
  
  if (!token) {
    res.status(401);
    throw new Error("tokne is not founded");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Users.findById(decoded.id).select("-password");
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Invalid token");
  }
});
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Access denied. Admin only.");
  }
  next();
};
