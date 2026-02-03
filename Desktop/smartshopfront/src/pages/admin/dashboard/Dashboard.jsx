import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, api } from "../../../api/authApi";
import "./Dashboard.css"; // Assure-toi de créer ce fichier

function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "CLIENT",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "ADMIN") {
      navigate("/");
    }

    // Récupérer les utilisateurs
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users");
        console.log("Users response:", response.data);
        if (Array.isArray(response.data.content)) {
          setUsers(response.data.content);
        } else {
          console.error(
            "Les données utilisateurs ne sont pas un tableau:",
            response.data,
          );
          setUsers([]);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error,
        );
        setUsers([]);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // Même en cas d'erreur, supprimer localStorage et rediriger
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/users", newUser);
      setNewUser({ username: "", password: "", role: "CLIENT" });
      setShowAddForm(false);
      // Refetch users
      const response = await api.get("/api/users");
      if (Array.isArray(response.data.content)) {
        setUsers(response.data.content);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
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
            onClick={() => setActive("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`sidebar-btn ${active === "users" ? "active" : ""}`}
            onClick={() => setActive("users")}
          >
            Users
          </button>
          <button
            className={`sidebar-btn ${active === "products" ? "active" : ""}`}
            onClick={() => navigate("/admin/products")}
          >
            Products
          </button>
          <button className="sidebar-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <h1>Bienvenue 🎉</h1>
          <div>
            <button
              className="add-user-btn"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              Ajouter Client
            </button>
            <button className="logout-btn-header" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {showAddForm && (
          <div className="add-user-form">
            <h2>Ajouter un Client</h2>
            <form onSubmit={handleAddUser}>
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />
              <button type="submit">Ajouter</button>
              <button type="button" onClick={() => setShowAddForm(false)}>
                Annuler
              </button>
            </form>
          </div>
        )}

        {/* Content */}
        <main className="content">
          {/* Stats Cards */}
          <div className="cards">
            <div className="card">
              <h3>Users</h3>
              <p>{Array.isArray(users) ? users.length : 0}</p>
            </div>
            <div className="card">
              <h3>Sales</h3>
              <p>75</p>
            </div>
            <div className="card">
              <h3>Revenue</h3>
              <p>$4,500</p>
            </div>
            <div className="card">
              <h3>Orders</h3>
              <p>34</p>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <h2>Recent Users</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) &&
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
