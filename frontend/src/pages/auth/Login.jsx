import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Login.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", formData);

            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            const role = response.data.user.role;

            if (role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/shopper/dashboard");
            }

        } catch (error) {
            alert(error.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;