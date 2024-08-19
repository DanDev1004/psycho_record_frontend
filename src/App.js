import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./common/Login";

import Users from "./pages/usuario/Users";
import AddUser from "./pages/usuario/AddUser";
import EditUser from "./pages/usuario/EditUser";

import Instructores from "./pages/instructor/Instructor";
import AddInstructor from "./pages/instructor/AddInstructor";
import EditInstructor from "./pages/instructor/EditInstructor";

import Alumnos from "./pages/alumno/Alumno";
import AddAlumno from "./pages/alumno/AddAlumno";
import EditAlumno from "./pages/alumno/EditAlumno";

import Tutores from "./pages/tutor/Tutores";
import AddTutor from "./pages/tutor/AddTutor";
import EditTutor from "./pages/tutor/EditTutor";

import ListadoAula from "./pages/listadoAula/ListadoAula";
import AddListadoAula from "./pages/listadoAula/AddListadoAula";

import Familiar from "./pages/familiar/Familiar";
import AddFamiliar from "./pages/familiar/AddFamiliar";
import EditFamiliar from "./pages/familiar/EditFamiliar";

import Derivaciones from "./pages/derivacion/derivacion";
import AddDerivacion from "./pages/derivacion/AddDerivacion";
import EditDerivacion from "./pages/derivacion/EditDerivacion";

import Consultasps from "./pages/consultaps/consultasps";
import AddConsultasps from "./pages/consultaps/AddConsultasps";
import EditConsultasps from "./pages/consultaps/EditConsultasps";
import PageDetailsConsultaPs from "./pages/consultaps/DetailsConsultasps";

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

          <Route path="/instructores" element={<Instructores/>}/>
          <Route path="/instructor/add" element={<AddInstructor/>}/>
          <Route path="/instructor/edit/:id" element={<EditInstructor/>}/>

          <Route path="/alumnos" element={<Alumnos/>}/>
          <Route path="/alumno/add" element={<AddAlumno/>}/>
          <Route path="/alumno/edit/:id" element={<EditAlumno/>}/>

          <Route path="/tutores" element={<Tutores/>}/>
          <Route path="/tutor/add" element={<AddTutor/>}/>
          <Route path="/tutor/edit/:id" element={<EditTutor/>}/>

          <Route path="/listadoAula" element={<ListadoAula/>}/>
          <Route path="/listadoAula/add" element={<AddListadoAula/>}/>

          <Route path="/familiar" element={<Familiar/>}/>
          <Route path="/familiar/add" element={<AddFamiliar/>}/>
          <Route path="/familiar/edit/:id" element={<EditFamiliar/>}/>

          <Route path="/derivaciones" element={<Derivaciones/>}/>
          <Route path="/derivacion/add" element={<AddDerivacion/>}/>
          <Route path="/derivacion/edit/:id" element={<EditDerivacion/>}/>

          <Route path="/Consultasps" element={<Consultasps/>}/>
          <Route path="/Consultasps/add" element={<AddConsultasps/>}/>
          <Route path="/Consultasps/edit/:id" element={<EditConsultasps/>}/>
          <Route path="/Consultasps/detail/:id" element={<PageDetailsConsultaPs/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;