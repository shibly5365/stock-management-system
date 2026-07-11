import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/Dashboard"
import ShopperDashboard from "../pages/shopper/Dashboard"
import Stores from "../pages/admin/Stores";
import Products from "../pages/admin/Products";
import Stocks from "../pages/admin/Stocks";
import AdjustStock from "../pages/admin/AdjustStock";
import TransferStock from "../pages/admin/TransferStock";
import ShopperProducts from "../pages/shopper/Products"
import ShopperStocks from "../pages/shopper/Stocks"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/shopper/dashboard" element={<ShopperDashboard />} />
      <Route path="/admin/stores" element={<Stores />} />
      <Route path="/admin/products" element={<Products />} />
      <Route path="/admin/stocks" element={<Stocks />} />
      <Route path="/admin/adjust-stock" element={<AdjustStock />} />
      <Route
        path="/admin/transfer-stock"
        element={<TransferStock />}
      />
      <Route path="/shopper/products" element={<ShopperProducts />} />
      <Route path="/shopper/stocks" element={<ShopperStocks />} />
    </Routes>
  );
};

export default AppRoutes;