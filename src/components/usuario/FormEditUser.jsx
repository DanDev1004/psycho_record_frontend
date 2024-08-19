import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux"; 
import "../../assets/styles/Form.css";

const FormEditUser = () => {
  const [dni, setDni] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [rol, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const { user } = useSelector((state) => state.auth); 

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/usuario/${id}`);
        setDni(response.data.DNI_USUARIO);
        setNombres(response.data.NOMBRE_USUARIO);
        setApellidos(response.data.APELLIDO_USUARIO);
        setUsername(response.data.USERNAME);
        setEmail(response.data.EMAIL);
        setPassword(""); 
        setConfPassword("");
        setRole(response.data.ID_ROL);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };

    const cargarRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/rol");
        setRoles(response.data);
      } catch (error) {
        console.error("Error al cargar los roles", error);
      }
    };

    getUserById();
    cargarRoles();
  }, [id]);

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/usuario/${id}`, {
        DNI_USUARIO: dni,
        NOMBRE_USUARIO: nombres,
        APELLIDO_USUARIO: apellidos,
        USERNAME: username,
        EMAIL: email,
        USER_PASSWORD: password || null,
        CONF_USER_PASSWORD: confPassword || null,
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

      <h1 className="title-form">Actualizar Usuarios</h1>

      <div className="contenedor">

        <form onSubmit={updateUser}>
          <p>{msg}</p>

          <div className="row">
            <div className="col-25">
              <label className="label-form">DNI</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="text"
                value={dni || ""}
                onChange={(e) => setDni(e.target.value)}
                placeholder="DNI"
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
                value={nombres || ""}
                onChange={(e) => setNombres(e.target.value)}
                placeholder="Nombres"
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
                value={apellidos || ""}
                onChange={(e) => setApellidos(e.target.value)}
                placeholder="Apellidos"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Username</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="text"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
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
                type="text"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
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
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
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
                value={confPassword || ""}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="******"
              />
            </div>
          </div>

          {user.ID_USUARIO !== parseInt(id) && (
            <div className="row">
              <div className="col-25">
                <label className="label-form">Rol</label>
              </div>
              <div className="col-75">
                <select
                  className="input-form"
                  value={rol || ""}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((role) => (
                    <option key={role.ID_ROL} value={role.ID_ROL}>
                      {role.NOMBRE_ROL}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="row">
            <button className="button-form" type="submit">Actualizar</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FormEditUser;
