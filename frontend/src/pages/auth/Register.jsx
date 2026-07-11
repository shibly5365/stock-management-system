import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "shopper",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/register", formData);

            alert(response.data.message);

            navigate("/login");
        } catch (error) {
            console.error("Register Error:", error);

            if (error.response) {
                console.error("Response Data:", error.response.data);
                console.error("Status:", error.response.status);

                alert(error.response.data.message);
            } else if (error.request) {
                console.error("No response received:", error.request);

                alert("Cannot connect to the server.");
            } else {
                console.error("Error:", error.message);

                alert(error.message);
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Register</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="shopper">Shopper</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;