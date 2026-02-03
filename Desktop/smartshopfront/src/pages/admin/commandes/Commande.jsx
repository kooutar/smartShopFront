import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, confirmOrder } from "../../../api/commande/orderService";
import { logout } from "../../../api/authApi";
import "./Commande.css";

function Commande() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [active, setActive] = useState("orders");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      if (Array.isArray(response.data.content)) {
        setOrders(response.data.content);
      } else {
        console.error(
          "Les données commandes ne sont pas un tableau:",
          response.data,
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await confirmOrder(id);
      fetchOrders(); // Refetch après confirmation
    } catch (error) {
      console.error("Erreur lors de la confirmation:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">Admin Panel</div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-btn ${active === "dashboard" ? "active" : ""}`}
            onClick={() => navigate("/Dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`sidebar-btn ${active === "users" ? "active" : ""}`}
            onClick={() => navigate("/Dashboard")}
          >
            Users
          </button>
          <button
            className={`sidebar-btn ${active === "products" ? "active" : ""}`}
            onClick={() => navigate("/admin/products")}
          >
            Products
          </button>
          <button
            className={`sidebar-btn ${active === "orders" ? "active" : ""}`}
            onClick={() => setActive("orders")}
          >
            Orders
          </button>
          <button className="sidebar-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <div className="orders-container">
          <h2>Toutes les Commandes</h2>
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.client?.nom || "N/A"}</td>
                  <td>{order.dateCommande}</td>
                  <td>{order.status}</td>
                  <td>{order.total} €</td>
                  <td>
                    {order.status !== "CONFIRMED" && (
                      <button
                        onClick={() => handleConfirm(order.id)}
                        className="confirm-btn"
                      >
                        Confirmer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Commande;
