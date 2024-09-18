import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom"; // Importar useParams
import Select from "react-select";
import { useSelector } from "react-redux";
import "../../assets/styles/Form.css";

const FormAddDerivacion = () => {
    const { user } = useSelector((state) => state.auth); // Obtener información del usuario autenticado
    const [usuarios, setUsuarios] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [alumno, setAlumno] = useState(null);
    const [motivo, setMotivo] = useState("");
    const [urgencia, setUrgencia] = useState(1);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { idAlumno } = useParams(); // Capturar el ID del alumno desde la URL

    useEffect(() => {
        const cargarUsuariosDocentes = async () => {
            try {
                const response = await axios.get("http://localhost:5000/usuario");
                const usuariosFiltrados = response.data
                    .filter((usuario) => usuario.ID_ROL === 3)
                    .map((usuario) => ({
                        value: usuario.ID_USUARIO,
                        label: `${usuario.NOMBRE_USUARIO} ${usuario.APELLIDO_USUARIO}`,
                    }));
                setUsuarios(usuariosFiltrados);
            } catch (error) {
                console.error("Error al cargar los usuarios", error);
            }
        };

        const cargarAlumnos = async () => {
            try {
                const response = await axios.get("http://localhost:5000/alumno");
                const alumnoOptions = response.data.map((alumno) => ({
                    value: alumno.ID_ALUMNO,
                    label: `${alumno.NOMBRES} ${alumno.APELLIDOS}`,
                }));
                setAlumnos(alumnoOptions);

                // Seleccionar automáticamente el alumno basado en el ID capturado en la URL
                const alumnoSeleccionado = alumnoOptions.find(
                    (alumno) => alumno.value === parseInt(idAlumno)
                );
                if (alumnoSeleccionado) {
                    setAlumno(alumnoSeleccionado);
                }
            } catch (error) {
                console.error("Error al cargar los alumnos", error);
            }
        };

        cargarUsuariosDocentes();
        cargarAlumnos();
    }, [idAlumno]); // Dependencia en idAlumno para recargar los datos cuando cambie

    useEffect(() => {
        // Si el usuario tiene rol 3, automáticamente seleccionamos al usuario conectado
        if (user?.ID_ROL === 3) {
            setUsuario({
                value: user.ID_USUARIO,
                label: `${user.NOMBRE_USUARIO} ${user.APELLIDO_USUARIO}`
            });
        }
    }, [user]);

    const guardarDerivacion = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/derivacion", {
                ID_USUARIO: usuario.value,
                ID_ALUMNO: alumno.value,
                MOTIVO: motivo,
                URGENCIA: Number(urgencia),
            });
            navigate("/derivaciones");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <div>
            <NavLink to={"/derivaciones"}>
                <button className="btn-regresar">Regresar</button>
            </NavLink>

            <h1 className="title-form">Agregar Derivación</h1>

            <div className="contenedor">
                <form onSubmit={guardarDerivacion} className="form-container">
                    <p>{msg}</p>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Usuario</label>
                        </div>
                        <div className="col-75">
                            {user?.ID_ROL === 3 ? (
                                <input
                                    type="text"
                                    value={`${user.NOMBRE_USUARIO} ${user.APELLIDO_USUARIO}`}
                                    className="input-form"
                                    readOnly
                                />
                            ) : (
                                <Select
                                    value={usuario}
                                    onChange={setUsuario}
                                    options={usuarios}
                                    placeholder="Seleccionar remitente"
                                    className="input-form"
                                    isClearable
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Alumno</label>
                        </div>
                        <div className="col-75">
                            <Select
                                value={alumno}
                                onChange={setAlumno}
                                options={alumnos}
                                placeholder="Selecciona un alumno"
                                className="input-form"
                                isClearable
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Motivo</label>
                        </div>
                        <div className="col-75">
                            <textarea
                                className="input-form"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Urgencia</label>
                        </div>
                        <div className="col-75">
                            <select
                                className="input-form"
                                value={urgencia}
                                onChange={(e) => setUrgencia(e.target.value)}
                                required
                            >
                                <option value="1">Baja</option>
                                <option value="2">Media</option>
                                <option value="3">Alta</option>
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

export default FormAddDerivacion;
