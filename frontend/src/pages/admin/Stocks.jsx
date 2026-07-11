import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./Stocks.css";

function Stocks() {
    const [stocks, setStocks] = useState([]);
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);

    const [formData, setFormData] = useState({
        product: "",
        store: "",
        quantity: "",
    });

    const [editingId, setEditingId] = useState(null);

    // Get Stocks
    const getStocks = async () => {
        try {
            const response = await api.get("/stocks");
            setStocks(response.data.data);
        } catch (error) {
            alert("Failed to fetch stocks");
        }
    };

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
        getStocks();
        getProducts();
        getStores();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Create / Update Stock
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await api.put(`/stocks/${editingId}`, {
                    quantity: Number(formData.quantity),
                });

                alert("Stock updated successfully");
            } else {
                await api.post("/stocks", {
                    product: formData.product,
                    store: formData.store,
                    quantity: Number(formData.quantity),
                });

                alert("Stock created successfully");
            }

            setFormData({
                product: "",
                store: "",
                quantity: "",
            });

            setEditingId(null);

            getStocks();
        } catch (error) {
            alert(error.response?.data?.message || "Operation failed");
        }
    };

    // Edit Stock
    const handleEdit = (stock) => {
        setEditingId(stock._id);

        setFormData({
            product: stock.product._id,
            store: stock.store._id,
            quantity: stock.quantity,
        });
    };

    // Delete Stock
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this stock?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/stocks/${id}`);

            alert("Stock deleted successfully");

            getStocks();

            if (editingId === id) {
                setEditingId(null);

                setFormData({
                    product: "",
                    store: "",
                    quantity: "",
                });
            }
        } catch (error) {
            alert(error.response?.data?.message || "Delete failed");
        }
    };

    return (
        <>
            <Navbar />

            <div className="stocks-container">
                <Sidebar />

                <div className="stocks-content">
                    <h2>Stocks</h2>

                    <form className="stock-form" onSubmit={handleSubmit}>
                        <select
                            name="product"
                            value={formData.product}
                            onChange={handleChange}
                            disabled={editingId}
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
                            name="store"
                            value={formData.store}
                            onChange={handleChange}
                            disabled={editingId}
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
                            placeholder="Quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit">
                            {editingId ? "Update Stock" : "Add Stock"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setEditingId(null);

                                    setFormData({
                                        product: "",
                                        store: "",
                                        quantity: "",
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>

                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Store</th>
                                <th>Location</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {stocks.length > 0 ? (
                                stocks.map((stock) => (
                                    <tr key={stock._id}>
                                        <td>{stock.product.name}</td>
                                        <td>{stock.product.sku}</td>
                                        <td>{stock.store.name}</td>
                                        <td>{stock.store.location}</td>
                                        <td>{stock.quantity}</td>

                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(stock)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(stock._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No Stocks Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Stocks;