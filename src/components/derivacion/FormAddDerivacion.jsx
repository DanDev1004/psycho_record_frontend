import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Select from "react-select";
import "../../assets/styles/Form.css";

const FormAddDerivacion = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [listadoAulas, setListadoAulas] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [listadoAula, setListadoAula] = useState(null);
    const [motivo, setMotivo] = useState("");
    const [severidad, setSeveridad] = useState(1);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const response = await axios.get("http://localhost:5000/usuario");
                const usuariosFiltrados = response.data
                    .filter((usuario) => usuario.ID_ROL === 2)
                    .map((usuario) => ({
                        value: usuario.ID_USUARIO,
                        label: `${usuario.NOMBRE_USUARIO} ${usuario.APELLIDO_USUARIO}`,
                    }));
                setUsuarios(usuariosFiltrados);
            } catch (error) {
                console.error("Error al cargar los usuarios", error);
            }
        };

        const cargarListadoAulas = async () => {
            try {
                const response = await axios.get("http://localhost:5000/listadoaula");
                const listadoOptions = response.data
                .filter(listado => listado.TUTOR && listado.TUTOR.INSTRUCTOR.ID_AREA_PE)
                .map((listado) => ({
                    value: listado.ID_LISTADO_AULA,
                    label: `${listado.ALUMNO.NOMBRE_ALUMNO} ${listado.ALUMNO.APELLIDO_ALUMNO}`,
                }));
                setListadoAulas(listadoOptions);
            } catch (error) {
                console.error("Error al cargar los listados de aula", error);
            }
        };

        cargarUsuarios();
        cargarListadoAulas();
    }, []);

    const guardarDerivacion = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/derivacion", {
                ID_USUARIO: usuario.value,
                ID_LISTADO_AULA: listadoAula.value,
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
                            <Select
                                value={usuario}
                                onChange={setUsuario}
                                options={usuarios}
                                placeholder="Seleccionar remitente"
                                className="input-form"
                                isClearable
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Listado Aula</label>
                        </div>
                        <div className="col-75">
                            <Select
                                value={listadoAula}
                                onChange={setListadoAula}
                                options={listadoAulas}
                                placeholder="Selecciona un listado de aula"
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

export default FormAddDerivacion;
