import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./Stores.css";

function Stores() {
    const [stores, setStores] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        location: "",
    });

    const [editingId, setEditingId] = useState(null);

    // Get All Stores
    const getStores = async () => {
        try {
            const response = await api.get("/stores");
            setStores(response.data.data);
        } catch (error) {
            console.log(error);
            alert("Failed to fetch stores");
        }
    };

    useEffect(() => {
        getStores();
    }, []);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Create / Update Store
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await api.put(`/stores/${editingId}`, formData);
                alert("Store updated successfully");
            } else {
                await api.post("/stores", formData);
                alert("Store created successfully");
            }

            setFormData({
                name: "",
                location: "",
            });

            setEditingId(null);

            getStores();
        } catch (error) {
            alert(error.response?.data?.message || "Operation failed");
        }
    };

    // Edit Store
    const handleEdit = (store) => {
        setFormData({
            name: store.name,
            location: store.location,
        });

        setEditingId(store._id);
    };

    // Delete Store
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this store?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/stores/${id}`);

            alert("Store deleted successfully");

            if (editingId === id) {
                setEditingId(null);
                setFormData({
                    name: "",
                    location: "",
                });
            }

            getStores();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete store");
        }
    };

    return (
        <>
            <Navbar />

            <div className="stores-container">
                <Sidebar />

                <div className="stores-content">
                    <h2>Stores</h2>

                    <form className="store-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Store Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit">
                            {editingId ? "Update Store" : "Add Store"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({
                                        name: "",
                                        location: "",
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
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {stores.length > 0 ? (
                                stores.map((store) => (
                                    <tr key={store._id}>
                                        <td>{store.name}</td>
                                        <td>{store.location}</td>

                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(store)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(store._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No Stores Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Stores;