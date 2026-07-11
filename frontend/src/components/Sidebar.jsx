import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Sidebar.css";

function Sidebar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.log(error);
        }

        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <aside className="sidebar">
            {role === "admin" && (
                <>
                    <NavLink to="/admin/dashboard">Dashboard</NavLink>

                    <NavLink to="/admin/stores">Stores</NavLink>

                    <NavLink to="/admin/products">Products</NavLink>

                    <NavLink to="/admin/stocks">Stocks</NavLink>

                    <NavLink to="/admin/adjust-stock">Adjust Stock</NavLink>

                    <NavLink to="/admin/transfer-stock">Transfer Stock</NavLink>
                </>
            )}

            {role === "shopper" && (
                <>
                    <NavLink to="/shopper/dashboard">Dashboard</NavLink>

                    <NavLink to="/shopper/products">Products</NavLink>

                    <NavLink to="/shopper/stocks">Stocks</NavLink>
                </>
            )}

            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>
        </aside>
    );
}

export default Sidebar;