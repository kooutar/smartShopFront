import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Client() {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "client") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Espace Client</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Déconnexion
        </button>
      </header>
      <main className="p-8">
        <h2 className="text-xl mb-4">Bienvenue dans votre espace client !</h2>
        <p>Contenu pour les clients...</p>
      </main>
    </div>
  );
}

export default Client;
