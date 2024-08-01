import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UsuarioList = () => {
  const [usuarios, setUsers] = useState([]);

  useEffect(() => {
    obtenerTodos();
  }, []);

  const obtenerTodos = async () => {
    const response = await axios.get("http://localhost:5000/usuario");
    setUsers(response.data);
  };

  const eliminar = async (userId) => {
    await axios.delete(`http://localhost:5000/usuario/${userId}`);
    obtenerTodos();
  };

  return (
    <div className="recentTable">

    <div class="TableHeader">
      <h2>DERIVACION</h2>

      <Link to="/usuario/add" className="btn">
      Agregar
    </Link>
    </div>


      <table>
        <thead>
          <tr>
            <th>N°</th>
            <th>DNI</th>
            <th>NOMBRE Y APELLIDO</th>
            <th>EMAIL</th>
            <th>USERNAME</th>
            <th>ROL</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((i, index) => (
            <tr key={i.ID_USUARIO}>
              <td>{index + 1}</td>
              <td>{i.DNI_USUARIO}</td>
              <td>{i.NOMBRE_USUARIO} {i.APELLIDO_USUARIO}</td>
              <td>{i.EMAIL}</td>
              <td>{i.USERNAME}</td>
              <td>{i.ROL.NOMBRE_ROL}</td>
              <td>
                <Link className="btn-edit"
                  to={`/usuario/edit/${i.ID_USUARIO}`}
                >
                  Editar
                </Link>
                <Link className="btn-delete"
                  onClick={() => eliminar(i.ID_USUARIO)}
                >
                  Eliminar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuarioList;
