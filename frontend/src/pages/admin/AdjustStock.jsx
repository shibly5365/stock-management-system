import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./AdjustStock.css";

function AdjustStock() {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);

  const [formData, setFormData] = useState({
    productId: "",
    storeId: "",
    quantity: "",
  });

  // Get Products
  const getProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Get Stores
  const getStores = async () => {
    try {
      const response = await api.get("/stores");
      setStores(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
    getStores();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.patch("/stocks/adjust", {
        productId: formData.productId,
        storeId: formData.storeId,
        quantity: Number(formData.quantity),
      });

      alert("Stock adjusted successfully");

      setFormData({
        productId: "",
        storeId: "",
        quantity: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to adjust stock");
    }
  };

  return (
    <>
      <Navbar />

      <div className="adjust-container">
        <Sidebar />

        <div className="adjust-content">
          <h2>Adjust Stock</h2>

          <form onSubmit={handleSubmit} className="adjust-form">
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
            >
              <option value="">Select Product</option>

              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>

            <select
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
              required
            >
              <option value="">Select Store</option>

              {stores.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="quantity"
              placeholder="Adjustment Quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />

            <button type="submit">Adjust Stock</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdjustStock;