import request from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";

import app from "../src/app.js";
import connectDB from "../src/config/db.js";

import Product from "../src/models/product.schema.js";
import Store from "../src/models/store.schema.js";
import Stock from "../src/models/stock.model.js";

dotenv.config();

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Adjust Stock API", () => {
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
      name: "Adjust Test Product",
      sku: `SKU${Date.now()}`,
    });

    store = await Store.create({
      name: `Adjust Store ${Date.now()}`,
      location: "Kochi",
    });

    await Stock.create({
      product: product._id,
      store: store._id,
      quantity: 100,
    });
  });

  test("Should adjust stock successfully", async () => {
    const response = await request(app)
      .patch("/api/stocks/adjust")
      .set("Cookie", cookie)
      .send({
        productId: product._id,
        storeId: store._id,
        quantity: -20,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const updatedStock = await Stock.findOne({
      product: product._id,
      store: store._id,
    });

    expect(updatedStock.quantity).toBe(80);
  });

  test("Should reject negative stock", async () => {
    const response = await request(app)
      .patch("/api/stocks/adjust")
      .set("Cookie", cookie)
      .send({
        productId: product._id,
        storeId: store._id,
        quantity: -200,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Insufficient stock");
  });
});