import request from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";

import app from "../src/app.js";
import connectDB from "../src/config/db.js";

dotenv.config();

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Authentication API", () => {
test("Should login successfully", async () => {
  const email = `login${Date.now()}@gmail.com`;

  // Register User
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Login User",
      email,
      password: "123456",
      role: "shopper",
    });

  // Login User
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password: "123456",
    });

  expect(response.statusCode).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.user.email).toBe(email);

  expect(response.body.user.role).toBe("shopper");

  // Check JWT Cookie
  expect(response.headers["set-cookie"]).toBeDefined();
}, 10000);
});