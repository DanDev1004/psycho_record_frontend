import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./common/Login";

import Users from "./pages/usuario/Users";
import AddUser from "./pages/usuario/AddUser";
import EditUser from "./pages/usuario/EditUser";

import Derivaciones from "./pages/derivacion/Derivaciones";
import AddDerivacion from "./pages/derivacion/AddDerivacion";
import EditDerivacion from "./pages/derivacion/EditDerivacion";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Users />} />
          <Route path="/usuario/add" element={<AddUser />} />
          <Route path="/usuario/edit/:id" element={<EditUser />} />
          <Route path="/derivaciones" element={<Derivaciones />} />
          <Route path="/derivaciones/add" element={<AddDerivacion />} />
          <Route path="/derivaciones/edit/:id" element={<EditDerivacion />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;