import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "../../assets/styles/Form.css";

import { IonIcon } from '@ionic/react';
import {
  eyeOutline,
  eyeOffOutline
} from "ionicons/icons";

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

  const [showPassword, setShowPassword] = useState(false); 
  const [showPassword2, setShowPassword2] = useState(false); 

  const [rol, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [genero, setGenero] = useState(""); 
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

  const generarUsername = (nombre, apellido, dni, rolSeleccionado) => {
    if (!nombre || !apellido || !dni || !rolSeleccionado) return;
  
    const nombrePart = nombre.slice(0, 4).toLowerCase();
    const apellidoPart = apellido.slice(0, 3).toLowerCase()
    const dniPart = dni.slice(0, 3);
    
    let sufijoRol = roles.find((r) => r.ID_ROL === parseInt(rolSeleccionado))?.NOMBRE_ROL.toLowerCase();
    if (sufijoRol === 'psicólogo') {
      sufijoRol = 'psico';
    } else {
      sufijoRol = sufijoRol.slice(0, 6); 
    }
  
    const nuevoUsername = `${nombrePart}${apellidoPart}${dniPart}_${sufijoRol}`;
    setUsername(nuevoUsername);
  };


  const handleNombresChange = (e) => {
    const nuevoNombre = e.target.value;
    setNombres(nuevoNombre);
    generarUsername(nuevoNombre, apellidos, dni, rol);
  };
  
  const handleApellidosChange = (e) => {
    const nuevoApellido = e.target.value;
    setApellidos(nuevoApellido);
    generarUsername(nombres, nuevoApellido, dni, rol);
  };
  
  const handleDniChange = (e) => {
    const nuevoDni = e.target.value;
    if (/^\d{0,8}$/.test(nuevoDni)) { 
      setDni(nuevoDni);
      generarUsername(nombres, apellidos, nuevoDni, rol);
    }
  };
  
  const handleRolChange = (e) => {
    const nuevoRol = e.target.value;
    setRole(nuevoRol);
    generarUsername(nombres, apellidos, dni, nuevoRol);
  };



  const validarPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{8,}$/;
    return regex.test(password);
  };

  const crear = async (e) => {
    e.preventDefault();

    if (!dni || !nombres || !apellidos || !username || !email || !genero) {
      setMsg("Por favor, complete todos los campos obligatorios.");
      return;
    }

    if (!validarPassword(password)) {
      setMsg("La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.");
      return;
    }

    if (password !== confPassword) {
      setMsg("La contraseña no coincide con la confirmación.");
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
        GENERO: Number(genero) 
      });
      navigate("/usuarios");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowPassword2 = () => {
    setShowPassword2(!showPassword2);
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
                onChange={handleDniChange}
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
                style={{ textTransform: 'uppercase' }}
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
                onChange={handleApellidosChange}
                style={{ textTransform: 'uppercase' }}
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
              <div className="password-wrapper">
                <input
                  className="input-form"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  required
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
                  type={showPassword2 ? "text" : "password"}
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                  placeholder="******"
                  required
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
