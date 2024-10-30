import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./common/Login";

import Users from "./pages/usuario/Users";
import AddUser from "./pages/usuario/AddUser";
import EditUser from "./pages/usuario/EditUser";

import Alumnos from "./pages/alumno/Alumno";
import AddAlumno from "./pages/alumno/AddAlumno";
import EditAlumno from "./pages/alumno/EditAlumno";
import PageDetailsAlumno from "./pages/alumno/DetailsAlumno";


import Derivaciones from "./pages/derivacion/derivacion";
import AddDerivacion from "./pages/derivacion/AddDerivacion";
import EditDerivacion from "./pages/derivacion/EditDerivacion";
import PageDetailsDerivacion from "./pages/derivacion/DetailsDerivacion";

import Consultasps from "./pages/consultaps/consultasps";
import AddConsultasps from "./pages/consultaps/AddConsultasps";
import EditConsultasps from "./pages/consultaps/EditConsultasps";
import PageDetailsConsultaPs from "./pages/consultaps/DetailsConsultasps";

import AddDiagnostico from "./pages/consultaps/AddDiagnostico";


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

          <Route path="/alumnos" element={<Alumnos/>}/>
          <Route path="/alumno/add" element={<AddAlumno/>}/>
          <Route path="/alumno/edit/:id" element={<EditAlumno/>}/>
          <Route path="/alumno/generar-cita/:idAlumno" element={<AddConsultasps />}/>
          <Route path="/alumno/derivar/:idAlumno" element={<AddDerivacion />}/>
          <Route path="/alumno/detail/:id" element={<PageDetailsAlumno/>}/>

          
          <Route path="/derivaciones" element={<Derivaciones/>}/>
          <Route path="/derivacion/add" element={<AddDerivacion/>}/>
          <Route path="/derivacion/edit/:id" element={<EditDerivacion/>}/>
          <Route path="/derivacion/detail/:id" element={<PageDetailsDerivacion/>}/>

          <Route path="/Consultasps" element={<Consultasps/>}/>
          <Route path="/Consultasps/add" element={<AddConsultasps/>}/>
          <Route path="/Consultasps/add/:id_alumno_derivado" element={<AddConsultasps/>}/>
          <Route path="/Consultasps/edit/:id" element={<EditConsultasps/>}/>
          <Route path="/Consultasps/detail/:id" element={<PageDetailsConsultaPs/>}/>

          <Route path="/diagnostico/add/:id" element={<AddDiagnostico/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;