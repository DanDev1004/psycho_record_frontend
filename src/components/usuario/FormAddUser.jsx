import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormAddUser = () => {
  const [dni, setDni] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [rol, setRole] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/usuario", {
        DNI_USUARIO: dni,
        NOMBRE_USUARIO: nombres,
        APELLIDO_USUARIO: apellidos,
        USERNAME: username,
        EMAIL: email,
        USER_PASSWORD: password,
        CONF_USER_PASSWORD: confPassword,
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
      <h1 className="title">Usuarios</h1>
      <h2 className="subtitle">Agregar uevo usuario</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={saveUser}>
              <p className="has-text-centered">{msg}</p>

              <div className="field">
                <label className="label">DNI</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="dni"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Nombres</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    placeholder="nombres"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Apellidos</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder="apellidos"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">username</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Confirm Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={confPassword}
                    onChange={(e) => setConfPassword(e.target.value)}
                    placeholder="******"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">rol</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={rol}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="1">Admin</option>
                      <option value="3">tutor</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddUser;
