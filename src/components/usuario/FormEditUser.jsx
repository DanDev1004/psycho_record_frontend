import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../assets/styles/Form.css";

import { IonIcon } from '@ionic/react';
import {
  eyeOutline,
  eyeOffOutline
} from "ionicons/icons";

import { ENDPOINTS } from "../../api/apiEndPoints";

const FormEditUser = () => {
  const [dni, setDni] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false); 
  const [showPassword2, setShowPassword2] = useState(false); 

  const [rol, setRol] = useState("");
  const [roles, setRoles] = useState([]);
  const [genero, setGenero] = useState(""); 
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const obtenerPorId = async () => {
      try {
        const response = await axios.get(ENDPOINTS.USUARIO.OBTENER_POR_ID(id));
        setDni(response.data.DNI_USUARIO);
        setNombres(response.data.NOMBRE_USUARIO);
        setApellidos(response.data.APELLIDO_USUARIO);
        setUsername(response.data.USERNAME);
        setEmail(response.data.EMAIL);
        setTelefono(response.data.TELEFONO);
        setGenero(response.data.GENERO);
        setPassword("");
        setConfPassword("");
        setRol(response.data.ID_ROL);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };

    const cargarRoles = async () => {
      try {
        const response = await axios.get(ENDPOINTS.ROL.OBTENER_TODOS);
        setRoles(response.data);
      } catch (error) {
        console.error("Error al cargar los roles", error);
      }
    };

    obtenerPorId();
    cargarRoles();
  }, [id]);

  const handleNombresChange = (e) => {
    const nuevoNombre = e.target.value;
    setNombres(nuevoNombre);
  };

  const handleRolChange = (e) => {
    const nuevoRol = e.target.value;
    setRol(nuevoRol);
  };

  const handleDniChange = (e) => {
    const nuevoDni = e.target.value;
    if (/^\d{0,8}$/.test(nuevoDni)) {
      setDni(nuevoDni);
    }
  };

  const handleTelefonoChange = (e) => {
    const nuevoTelefono = e.target.value;
    if (/^\d{0,9}$/.test(nuevoTelefono)) {
      setTelefono(nuevoTelefono);
    }
  };

  const validarPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{8,}$/;
    return regex.test(password);
  };

  const actualizar = async (e) => {
    e.preventDefault();

    if (!dni || !nombres || !apellidos || !username || !email || !genero) {
      setMsg("Por favor, complete todos los campos obligatorios.");
      return;
    }

    if (password && !validarPassword(password)) {
      setMsg("La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.");
      return;
    }

    if (password !== confPassword) {
      setMsg("La contraseña no coincide con la confirmación.");
      return;
    }

    try {
      await axios.patch(ENDPOINTS.USUARIO.ACTUALIZAR(id), {
        DNI_USUARIO: dni,
        NOMBRE_USUARIO: nombres,
        APELLIDO_USUARIO: apellidos,
        USERNAME: username,
        EMAIL: email,
        TELEFONO: telefono,
        PASSWORD_USER: password || null,
        CONFIRM_PASSWORD_USER: confPassword || null,
        ID_ROL: Number(rol),
        GENERO: Number(genero),
      });
      navigate("/usuarios");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowPassword2 = () => setShowPassword2(!showPassword2);

  return (
    <div>
      <NavLink to={"/usuarios"}>
        <button className="btn-regresar">Regresar</button>
      </NavLink>

      <h1 className="title-form">Actualizar Usuarios</h1>

      <div className="contenedor">
        <form onSubmit={actualizar}>
          <p style={{ color: 'red' }}>{msg}</p>

          <div className="row">
            <div className="col-25">
              <label className="label-form">DNI</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="text"
                value={dni || ""}
                onChange={handleDniChange}
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
                onChange={handleNombresChange}
                style={{ textTransform: 'uppercase' }}
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
                style={{ textTransform: 'uppercase' }}
                placeholder="Apellidos"
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
              <label className="label-form">Teléfono</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="text"
                value={telefono || ""}
                onChange={handleTelefonoChange}
                placeholder="987654321"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Género</label>
            </div>
            <div className="col-75">
              <select
                className="input-form"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                required
              >
                <option value="">Seleccionar género</option>
                <option value="1">Masculino</option>
                <option value="2">Femenino</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Password</label>
            </div>
            <div className="col-75">
              <div className="password-wrapper">
                <input
                  className="input-form"
                  style={{textTransform:'none'}}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                />
                <button 
                  type="button"
                  className="btn-show-password"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <IonIcon icon={eyeOffOutline} /> : <IonIcon icon={eyeOutline} />}
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Confirmar Password</label>
            </div>
            <div className="col-75">
              <div className="password-wrapper">
                <input
                  className="input-form"
                  style={{textTransform:'none'}}
                  type={showPassword2 ? "text" : "password"}
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                  placeholder="******"
                />
                <button
                  type="button"
                  className="btn-show-password"
                  onClick={toggleShowPassword2}
                >
                  {showPassword2 ? <IonIcon icon={eyeOffOutline} /> : <IonIcon icon={eyeOutline} />}
                </button>
              </div>
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
                  onChange={handleRolChange}
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
