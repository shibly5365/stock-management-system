import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import StocksRoutes from "./routes/stocksRoutes.js";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Helth Testing......",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stocks", StocksRoutes);
app.use(errorHandler);
export default app;
