import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const DerivaciontList = () => {
  const [derivaciones, setList] = useState([]);

  useEffect(() => {
    obtenerTodos();
  }, []);

  const obtenerTodos = async () => {
    const response = await axios.get("http://localhost:5000/derivacion");
    setList(response.data);
  };

  const eliminar = async (id) => {
    await axios.delete(`http://localhost:5000/derivacion/${id}`);
    obtenerTodos();
  };

  return (
    <div className="recentTable">

      <div class="TableHeader">
        <h2>DERIVACION</h2>

        <Link to="/derivaciones/add" className="btn">
        Agregar
      </Link>
      </div>
      

      <table>
        <thead>
          <tr>
            <th>N°</th>
            <th>id_usuario</th>
            <th>severidad</th>
            <th>DNI_user</th>
            <th>acciones</th>
          </tr>
        </thead>


        <tbody>


          {derivaciones.map((i, index) => (
            <tr key={i.ID_DERIVACION}>
              <td>{index + 1}</td>
              <td>{i.ID_USUARIO}</td>
              <td>{i.SEVERIDAD}</td>
              <td>{i.USUARIO.DNI_USUARIO}</td>
              <td>
                <Link className="btn-edit"
                  to={`/derivaciones/edit/${i.ID_DERIVACION}`}
                >
                  Editar
                </Link>
                <Link className="btn-delete"
                  onClick={() => eliminar(i.ID_DERIVACION)}
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

export default DerivaciontList;
