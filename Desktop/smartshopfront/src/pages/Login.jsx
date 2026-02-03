import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ username, password });

      // Stocker les infos utilisateur
      localStorage.setItem("user", JSON.stringify(response.data));
      console.log("user stored in localStorage:", response.data.role);
      // Redirection basée sur le rôle
      if (response.data.role === "ADMIN") {
        console.log("admin detected");
        navigate("/Dashboard");
      } else {
        navigate("/client"); // ou la page appropriée pour les clients
      }

      setMessage("Connexion réussie");
    } catch (error) {
      setMessage("Login ou mot de passe incorrect");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="login-title">Connexion</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          <button type="submit" className="login-button">
            Se connecter
          </button>
        </form>

        {typeof message === "string" && (
          <p
            className={`login-message ${
              message.includes("incorrect") ? "error" : "success"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
