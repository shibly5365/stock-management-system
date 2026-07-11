import request from "supertest";
import app from "../src/app.js";

describe("Health API", () => {
  test("GET / should return 200", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("Helth Testing......");
  });
});