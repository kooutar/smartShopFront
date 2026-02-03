import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
  updateProduct,
} from "../../../api/produit/productService";
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

  return (
    <div className="products-container">
      <h2>Tous les Produits</h2>
      <button
        onClick={() => navigate("/admin/add-product")}
        className="add-product-btn"
      >
        Ajouter un Produit
      </button>
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
          {products.map((product) => (
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
  );
}

export default GetALLProduct;
