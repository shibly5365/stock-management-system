import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./TransferStock.css";

function TransferStock() {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);

  const [formData, setFormData] = useState({
    productId: "",
    fromStore: "",
    toStore: "",
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

    if (formData.fromStore === formData.toStore) {
      return alert("Source and Destination stores cannot be the same.");
    }

    try {
      await api.post("/stocks/transfer", {
        productId: formData.productId,
        fromStore: formData.fromStore,
        toStore: formData.toStore,
        quantity: Number(formData.quantity),
      });
      console.log({
  productId: formData.productId,
  fromStore: formData.fromStore,
  toStore: formData.toStore,
  quantity: Number(formData.quantity),
});

      alert("Stock transferred successfully");

      setFormData({
        productId: "",
        fromStore: "",
        toStore: "",
        quantity: "",
      });
    } catch (error) {
        console.log(error);
        
      alert(error.response?.data?.message || "Transfer failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="transfer-container">
        <Sidebar />

        <div className="transfer-content">
          <h2>Transfer Stock</h2>

          <form className="transfer-form" onSubmit={handleSubmit}>
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
              name="fromStore"
              value={formData.fromStore}
              onChange={handleChange}
              required
            >
              <option value="">From Store</option>

              {stores.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.name}
                </option>
              ))}
            </select>

            <select
              name="toStore"
              value={formData.toStore}
              onChange={handleChange}
              required
            >
              <option value="">To Store</option>

              {stores.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />

            <button type="submit">Transfer Stock</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default TransferStock;