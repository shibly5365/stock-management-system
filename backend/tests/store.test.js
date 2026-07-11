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

describe("Store API", () => {
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

  test("Should create a store", async () => {
    const response = await request(app)
      .post("/api/stores")
      .set("Cookie", cookie)
      .send({
        name: `Store ${Date.now()}`,
        location: "Calicut",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
  });
});