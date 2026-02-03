import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../../api/produit/productService";
import "./AddProduct.css";

function AddProduct() {
  const [product, setProduct] = useState({
    nom: "",
    prixUnitaire: "",
    stockDisponible: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct({
        nom: product.nom,
        prixUnitaire: parseFloat(product.prixUnitaire),
        stockDisponible: parseInt(product.stockDisponible),
      });
      setMessage("Produit ajouté avec succès !");
      setProduct({ nom: "", prixUnitaire: "", stockDisponible: "" });
      // Optionnel : rediriger après un délai
      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (error) {
      setMessage("Erreur lors de l'ajout du produit.");
      console.error(error);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Ajouter un Produit</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label htmlFor="nom">Nom du Produit</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={product.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="prixUnitaire">Prix Unitaire</label>
          <input
            type="number"
            id="prixUnitaire"
            name="prixUnitaire"
            value={product.prixUnitaire}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stockDisponible">Stock Disponible</label>
          <input
            type="number"
            id="stockDisponible"
            name="stockDisponible"
            value={product.stockDisponible}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Ajouter Produit
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AddProduct;
