import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
  updateProduct,
} from "../../../api/produit/productService";
import { logout } from "../../../api/authApi";
import "./GetALLProduct.css";

function GetALLProduct() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    nom: "",
    prixUnitaire: "",
    stockDisponible: "",
  });
  const [searchId, setSearchId] = useState("");
  const [active, setActive] = useState("products");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      if (Array.isArray(response.data.content)) {
        setProducts(response.data.content);
      } else {
        console.error(
          "Les données produits ne sont pas un tableau:",
          response.data,
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(id);
        fetchProducts(); // Refetch après suppression
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setEditForm({
      nom: product.nom,
      prixUnitaire: product.prixUnitaire,
      stockDisponible: product.stockDisponible,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(editingProduct, {
        nom: editForm.nom,
        prixUnitaire: parseFloat(editForm.prixUnitaire),
        stockDisponible: parseInt(editForm.stockDisponible),
      });
      setEditingProduct(null);
      fetchProducts(); // Refetch après modification
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const filteredProducts = products.filter(
    (product) => searchId === "" || product.id.toString().includes(searchId),
  );

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
            onClick={() => setActive("products")}
          >
            Products
          </button>
          <button
            className={`sidebar-btn ${active === "orders" ? "active" : ""}`}
            onClick={() => navigate("/admin/orders")}
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
        <div className="products-container">
          <h2>Tous les Produits</h2>
          <button
            onClick={() => navigate("/admin/add-product")}
            className="add-product-btn"
          >
            Ajouter un Produit
          </button>
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher par ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="search-input"
            />
          </div>
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prix Unitaire</th>
                <th>Stock Disponible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    {editingProduct === product.id ? (
                      <input
                        type="text"
                        name="nom"
                        value={editForm.nom}
                        onChange={handleEditChange}
                      />
                    ) : (
                      product.nom
                    )}
                  </td>
                  <td>
                    {editingProduct === product.id ? (
                      <input
                        type="number"
                        name="prixUnitaire"
                        value={editForm.prixUnitaire}
                        onChange={handleEditChange}
                        step="0.01"
                      />
                    ) : (
                      product.prixUnitaire
                    )}
                  </td>
                  <td>
                    {editingProduct === product.id ? (
                      <input
                        type="number"
                        name="stockDisponible"
                        value={editForm.stockDisponible}
                        onChange={handleEditChange}
                      />
                    ) : (
                      product.stockDisponible
                    )}
                  </td>
                  <td>
                    {editingProduct === product.id ? (
                      <>
                        <button onClick={handleEditSubmit} className="save-btn">
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => setEditingProduct(null)}
                          className="cancel-btn"
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(product)}
                          className="edit-btn"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="delete-btn"
                        >
                          Supprimer
                        </button>
                      </>
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

export default GetALLProduct;
