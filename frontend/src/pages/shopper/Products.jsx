import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data);
    } catch (error) {
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <Navbar />

      <div className="products-container">
        <Sidebar />

        <div className="products-content">
          <h2>Products</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Products;