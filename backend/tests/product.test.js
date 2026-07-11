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

describe("Product API", () => {
  let cookie;

  beforeAll(async () => {
    const email = `admin${Date.now()}@gmail.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin",
        email,
        password: "123456",
        role: "admin",
      });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "123456",
      });

    cookie = login.headers["set-cookie"];
  });

  test("Should create a product", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Cookie", cookie)
      .send({
        name: "iPhone Test",
        sku: `SKU${Date.now()}`,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
  });
});