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
          <h2>Shopper Dashboard</h2>

          <p>Welcome Shopper</p>

          <p>You can view products and stock available in all stores.</p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;