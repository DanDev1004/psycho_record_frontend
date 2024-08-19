import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "../../assets/styles/Form.css";

const FormEditDerivacion = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [listadoAulas, setListadoAulas] = useState([]);
    const [usuario, setUsuario] = useState("");
    const [listadoAula, setListadoAula] = useState("");
    const [motivo, setMotivo] = useState("");
    const [severidad, setSeveridad] = useState(1);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const response = await axios.get("http://localhost:5000/usuario");
                setUsuarios(response.data);
            } catch (error) {
                console.error("Error al cargar los usuarios", error);
            }
        };

        const cargarListadoAulas = async () => {
            try {
                const response = await axios.get("http://localhost:5000/listadoaula");
                setListadoAulas(response.data);
            } catch (error) {
                console.error("Error al cargar los listados de aula", error);
            }
        };

        const obtenerDerivacionPorId = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/derivacion/${id}`);
                const derivacion = response.data;
                setUsuario(derivacion.ID_USUARIO);
                setListadoAula(derivacion.ID_LISTADO_AULA);
                setMotivo(derivacion.MOTIVO);
                setSeveridad(derivacion.SEVERIDAD);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };

        cargarUsuarios();
        cargarListadoAulas();
        obtenerDerivacionPorId();
    }, [id]);

    const actualizarDerivacion = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/derivacion/${id}`, {
                ID_USUARIO: Number(usuario),
                ID_LISTADO_AULA: Number(listadoAula),
                MOTIVO: motivo,
                SEVERIDAD: Number(severidad),
            });
            navigate("/derivaciones");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    // Obtener el nombre completo del usuario
    const obtenerNombreUsuario = (usuarioId) => {
        const usuarioEncontrado = usuarios.find((user) => user.ID_USUARIO === usuarioId);
        return usuarioEncontrado
            ? `${usuarioEncontrado.NOMBRE_USUARIO} ${usuarioEncontrado.APELLIDO_USUARIO}`
            : "";
    };

    // Obtener el nombre completo del alumno
    const obtenerNombreAlumno = (listadoAulaId) => {
        const listadoEncontrado = listadoAulas.find(
            (listado) => listado.ID_LISTADO_AULA === listadoAulaId
        );
        return listadoEncontrado
            ? `${listadoEncontrado.ALUMNO.NOMBRE_ALUMNO} ${listadoEncontrado.ALUMNO.APELLIDO_ALUMNO}`
            : "";
    };

    return (
        <div>
            <NavLink to={"/derivaciones"}>
                <button className="btn-regresar">Regresar</button>
            </NavLink>

            <h1 className="title-form">Editar Derivación</h1>

            <div className="contenedor">
                <form onSubmit={actualizarDerivacion} className="form-container">
                    <p>{msg}</p>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Usuario</label>
                        </div>
                        <div className="col-75">
                            <input
                                type="text"
                                className="input-form"
                                value={obtenerNombreUsuario(usuario)}
                                readOnly
                                style={{border:"none", pointerEvents:"none"}}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Alumno</label>
                        </div>
                        <div className="col-75">
                            <input
                                type="text"
                                className="input-form"
                                value={obtenerNombreAlumno(listadoAula)}
                                readOnly
                                style={{border:"none", pointerEvents:"none"}}
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
                            <label className="label-form">Severidad</label>
                        </div>
                        <div className="col-75">
                            <select
                                className="input-form"
                                value={severidad}
                                onChange={(e) => setSeveridad(e.target.value)}
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

export default FormEditDerivacion;
