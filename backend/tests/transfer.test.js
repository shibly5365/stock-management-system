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

describe("Transfer Stock API", () => {
  let cookie;
  let product;
  let storeA;
  let storeB;

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
      name: "Transfer Product",
      sku: `SKU${Date.now()}`,
    });

    storeA = await Store.create({
      name: `StoreA${Date.now()}`,
      location: "Calicut",
    });

    storeB = await Store.create({
      name: `StoreB${Date.now()}`,
      location: "Kochi",
    });

    await Stock.create({
      product: product._id,
      store: storeA._id,
      quantity: 100,
    });

    await Stock.create({
      product: product._id,
      store: storeB._id,
      quantity: 50,
    });
  });

  test("Should transfer stock successfully", async () => {
    const response = await request(app)
      .post("/api/stocks/transfer")
      .set("Cookie", cookie)
      .send({
        productId: product._id,
        fromStore: storeA._id,
        toStore: storeB._id,
        quantity: 20,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const source = await Stock.findOne({
      product: product._id,
      store: storeA._id,
    });

    const destination = await Stock.findOne({
      product: product._id,
      store: storeB._id,
    });

    expect(source.quantity).toBe(80);
    expect(destination.quantity).toBe(70);
  });

  test("Should reject transfer when stock is insufficient", async () => {
    const response = await request(app)
      .post("/api/stocks/transfer")
      .set("Cookie", cookie)
      .send({
        productId: product._id,
        fromStore: storeA._id,
        toStore: storeB._id,
        quantity: 1000,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Insufficient stock.");
  });
});