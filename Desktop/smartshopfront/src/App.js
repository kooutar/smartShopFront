import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Client from "./pages/client/Client";
import AddProduct from "./pages/admin/produit/AddProduct";
import GetALLProduct from "./pages/admin/produit/GetALLProduct";
import Commande from "./pages/admin/commandes/Commande";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/products" element={<GetALLProduct />} />
        <Route path="/admin/orders" element={<Commande />} />
        <Route path="/client" element={<Client />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
