import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./Stocks.css";

function Stocks() {
  const [stocks, setStocks] = useState([]);

  const getStocks = async () => {
    try {
      const response = await api.get("/stocks");
      setStocks(response.data.data);
    } catch (error) {
      alert("Failed to fetch stocks");
    }
  };

  useEffect(() => {
    getStocks();
  }, []);

  return (
    <>
      <Navbar />

      <div className="stocks-container">
        <Sidebar />

        <div className="stocks-content">
          <h2>Stocks</h2>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Store</th>
                <th>Quantity</th>
              </tr>
            </thead>

            <tbody>
              {stocks.map((stock) => (
                <tr key={stock._id}>
                  <td>{stock.product.name}</td>
                  <td>{stock.store.name}</td>
                  <td>{stock.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Stocks;