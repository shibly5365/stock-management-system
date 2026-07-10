import Users from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Pleace fill all the fields");
  }
  const userExists = await Users.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error("Usr alredy Exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Users.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
  if (!user) {
    res.status(500);
    throw new Error("Failed to register user");
  }
  res.status(201).json({
    success: true,
    message: "user register is done",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }
  const user = await Users.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  generateToken(res, user._id, user.role);
  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});