import request from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";

import app from "../src/app.js";
import connectDB from "../src/config/db.js";

import Product from "../src/models/product.schema.js";
import Store from "../src/models/store.schema.js";

dotenv.config();

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Stock API", () => {
  let cookie;
  let product;
  let store;

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

    product = await Product.create({
      name: "MacBook Test",
      sku: `SKU${Date.now()}`,
    });

    store = await Store.create({
      name: `Store ${Date.now()}`,
      location: "Calicut",
    });
  });

  test("Should create stock", async () => {
    const response = await request(app)
      .post("/api/stocks")
      .set("Cookie", cookie)
      .send({
        product: product._id,
        store: store._id,
        quantity: 100,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
  });
});