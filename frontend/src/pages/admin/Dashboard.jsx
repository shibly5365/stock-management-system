import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./Dashboard.css";

function Dashboard() {
    return (
        <>
            <Navbar />

            <div className="dashboard-container">
                <Sidebar />

                <div className="dashboard-content">
                    <h1>Admin Dashboard</h1>

                    <p>Welcome Admin</p>

                    <p>
                        Use the sidebar to manage Stores, Products, Stocks, Adjust Stock,
                        and Transfer Stock.
                    </p>
                </div>
            </div>
        </>
    );
}

export default Dashboard;