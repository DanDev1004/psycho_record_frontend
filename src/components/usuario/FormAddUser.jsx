import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "../../assets/styles/Form.css";

import { ENDPOINTS } from "../../api/apiEndPoints";

const FormAddUser = () => {
  const [dni, setDni] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [rol, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const response = await axios.get(ENDPOINTS.ROL.OBTENER_TODOS);
        setRoles(response.data);
      } catch (error) {
        console.error("Error al cargar los roles", error);
      }
    };
    cargarRoles();
  }, []);

  const generarUsername = (nombre, rolSeleccionado) => {
    if (!nombre || !rolSeleccionado) return;
    
    const primerNombre = nombre.split(" ")[0].toLowerCase();
    
    const rolNombre = roles.find((r) => r.ID_ROL === parseInt(rolSeleccionado))?.NOMBRE_ROL.toLowerCase();
    
    if (primerNombre && rolNombre) {
      setUsername(`${primerNombre}_${rolNombre}`);
    }
  };

  const handleNombresChange = (e) => {
    const nuevoNombre = e.target.value;
    setNombres(nuevoNombre);
    generarUsername(nuevoNombre, rol);
  };

  const handleRolChange = (e) => {
    const nuevoRol = e.target.value;
    setRole(nuevoRol);
    generarUsername(nombres, nuevoRol); 
  };

  const crear = async (e) => {
    e.preventDefault();

    if (!dni || !nombres || !apellidos || !username || !email) {
      setMsg("Por favor, complete todos los campos obligatorios.");
      return;
    }

    try {
      await axios.post(ENDPOINTS.USUARIO.CREAR, {
        DNI_USUARIO: dni,
        NOMBRE_USUARIO: nombres,
        APELLIDO_USUARIO: apellidos,
        USERNAME: username, 
        EMAIL: email,
        TELEFONO: telefono,
        PASSWORD_USER: password,
        CONFIRM_PASSWORD_USER: confPassword,
        ID_ROL: Number(rol),
      });
      navigate("/usuarios");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <NavLink to={"/usuarios"}>
        <button className="btn-regresar">Regresar</button>
      </NavLink>

      <h1 className="title-form">Agregar Usuarios</h1>

      <div className="contenedor">
        <form onSubmit={crear}>
          <p style={{ color: 'red' }}>{msg}</p>

          <div className="row">
            <div className="col-25">
              <label className="label-form">DNI</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="text"
                value={dni}
                onChange={(e) => {
                  const value = e.target.value;
                  //regex
                  if (/^\d{0,8}$/.test(value)) {
                      setDni(e.target.value);
                  }
              }}
                placeholder="DNI"
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Nombres</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="text"
                value={nombres}
                onChange={handleNombresChange}
                style={{ textTransform: 'capitalize' }}
                placeholder="Nombres"
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Apellidos</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                style={{ textTransform: 'capitalize' }}
                placeholder="Apellidos"
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Email</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@email.com"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Teléfono</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="text"
                value={telefono}
                onChange={(e) => {
                  const value = e.target.value;
                  //regex
                  if (/^\d{0,9}$/.test(value)) {
                      setTelefono(value);
                  }
              }}
                placeholder="987654321"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Password</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Confirmar Password</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="password"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="******"
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Rol</label>
            </div>
            <div className="col-75">
              <select
                className="input-form"
                value={rol}
                onChange={handleRolChange}
                required
              >
                <option value="">Seleccionar un rol</option>
                {roles.map((role) => (
                  <option key={role.ID_ROL} value={role.ID_ROL}>
                    {role.NOMBRE_ROL}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <button className="button-form" type="submit">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAddUser;
