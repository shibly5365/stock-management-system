import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
  });

  const [editingId, setEditingId] = useState(null);

  // Get Products
  const getProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create / Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
        alert("Product updated successfully");
      } else {
        await api.post("/products", formData);
        alert("Product created successfully");
      }

      setFormData({
        name: "",
        sku: "",
      });

      setEditingId(null);

      getProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  // Edit Product
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
    });

    setEditingId(product._id);
  };

  // Delete Product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);

      alert("Product deleted successfully");

      getProducts();

      if (editingId === id) {
        setEditingId(null);
        setFormData({
          name: "",
          sku: "",
        });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="products-container">
        <Sidebar />

        <div className="products-content">
          <h2>Products</h2>

          <form className="product-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="sku"
              placeholder="SKU"
              value={formData.sku}
              onChange={handleChange}
              required
            />

            <button type="submit">
              {editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: "",
                    sku: "",
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
                <th>Name</th>
                <th>SKU</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No Products Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Products;