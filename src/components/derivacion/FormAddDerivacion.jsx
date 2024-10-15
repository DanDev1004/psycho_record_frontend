import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useSelector } from "react-redux";
import "../../assets/styles/Form.css";

import { convertirRomanos } from "../../utils/utils";
import { ENDPOINTS } from "../../api/apiEndPoints";

const FormAddDerivacion = () => {
    const { user } = useSelector((state) => state.auth);
    const [usuarios, setUsuarios] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [areaPe, setAreaPe] = useState(null);
    const [areasPe, setAreasPe] = useState([]);
    const [ciclo, setCiclo] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [alumno, setAlumno] = useState(null);
    const [motivo, setMotivo] = useState("");
    const [urgencia, setUrgencia] = useState(1);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { idAlumno } = useParams();


    useEffect(() => {
        const cargarUsuariosDocentes = async () => {
            try {
                const response = await axios.get(ENDPOINTS.USUARIO.OBTENER_TODOS);
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
                const response = await axios.get(ENDPOINTS.ALUMNO.OBTENER_TODOS);
                const alumnoOptions = response.data.map((alumno) => ({
                    value: alumno.ID_ALUMNO,
                    label: `${alumno.NOMBRES} ${alumno.APELLIDOS} - ${alumno.AREA_PE.NOMBRE_AREA_PE} - ${alumno.CICLO}`,
                    idAreaPe: alumno.AREA_PE.ID_AREA_PE,
                    ciclo: alumno.CICLO,
                }));
                setAlumnos(alumnoOptions);

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

        const cargarAreasPe = async () => {
            try {
                const response = await axios.get(ENDPOINTS.AREAPE.OBTENER_TODOS);
                const areasOptions = response.data.map((area) => ({
                    value: area.ID_AREA_PE,
                    label: area.NOMBRE_AREA_PE,
                }));
                setAreasPe(areasOptions);
            } catch (error) {
                console.error("Error al cargar las áreas", error);
            }
        };

        cargarUsuariosDocentes();
        cargarAlumnos();
        cargarAreasPe();
    }, [idAlumno]);

    const alumnosFiltrados = alumnos.filter((alumno) => {
        if (!areaPe && !ciclo) {
            return true;
        }
        if (areaPe && ciclo) {
            return alumno.idAreaPe === areaPe.value && alumno.ciclo === ciclo.value;
        }
        if (areaPe) {
            return alumno.idAreaPe === areaPe.value;
        }
        if (ciclo) {
            return alumno.ciclo === ciclo.value;
        }
        return true;
    });

    const ciclosOptions = [
        { value: 1, label: convertirRomanos(1) },
        { value: 2, label: convertirRomanos(2) },
        { value: 3, label: convertirRomanos(3) },
        { value: 4, label: convertirRomanos(4) },
        { value: 5, label: convertirRomanos(5) },
        { value: 6, label: convertirRomanos(6) }
    ];

    const crear = async (e) => {
        e.preventDefault();

        try {
            await axios.post(ENDPOINTS.DERIVACION.CREAR, {
                ID_USUARIO: (user?.ID_ROL === 3 ) ? user.ID_USUARIO : usuario.value,
                ID_ALUMNO: alumno.value,
                MOTIVO: motivo,
                URGENCIA: Number(urgencia),
            });
            navigate("/derivaciones");
        } catch (error) {
            console.error("Error al guardar la derivación", error); 
        }
    };

    return (
        <div>
            <NavLink to={"/derivaciones"}>
                <button className="btn-regresar">Regresar</button>
            </NavLink>

            <h1 className="title-form">Agregar Derivación</h1>

            <div className="contenedor">
                <form onSubmit={crear} className="form-container">
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
                                    onChange={setUsuario}
                                    className="input-form input-tutor"
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

                    {!idAlumno ? (
                        <div className="row">
                            <div className="col-25">
                                <label className="label-form">Área de Estudio</label>
                            </div>
                            <div className="col-75">
                                <Select
                                    value={areaPe}
                                    onChange={setAreaPe}
                                    options={areasPe}
                                    placeholder="Seleccionar área de estudio"
                                    className="input-form"
                                    isClearable
                                />
                            </div>
                        </div>
                    ) : null}
                    
                    {!idAlumno ? (
                        <div className="row">
                            <div className="col-25">
                                <label className="label-form">Ciclo</label>
                            </div>
                            <div className="col-75">

                                <Select
                                    value={ciclo}
                                    onChange={setCiclo}
                                    options={ciclosOptions}
                                    placeholder="Seleccionar ciclo"
                                    className="input-form"
                                    isClearable

                                />

                            </div>
                        </div>
                    ) : null}

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Alumno</label>
                        </div>
                        <div className="col-75">
                            <Select
                                value={alumno}
                                onChange={setAlumno}
                                options={alumnosFiltrados}
                                placeholder="Selecciona un alumno"
                                className="input-form"
                                isClearable
                                isDisabled={!!idAlumno}
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

                        <div className="col-75 caja-radio-button">
                            <div className="opciones-radio">
                                <div className="form-group">
                                    <span className="opcion-radio">
                                        <input
                                            type="radio"
                                            id="urgencia_baja"
                                            name="urgencia"
                                            value="1"
                                            checked={urgencia === 1}
                                            onChange={(e) => setUrgencia(Number(e.target.value))}
                                            className="radio_baja"
                                        />
                                        <label htmlFor="urgencia_baja">Baja</label>
                                    </span>

                                    <span className="opcion-radio">
                                        <input
                                            type="radio"
                                            id="urgencia_media"
                                            name="urgencia"
                                            value="2"
                                            checked={urgencia === 2}
                                            onChange={(e) => setUrgencia(Number(e.target.value))}
                                            className="radio_media"
                                        />
                                        <label htmlFor="urgencia_media">Media</label>
                                    </span>

                                    <span className="opcion-radio">
                                        <input
                                            type="radio"
                                            id="urgencia_alta"
                                            name="urgencia"
                                            value="3"
                                            checked={urgencia === 3}
                                            onChange={(e) => setUrgencia(Number(e.target.value))}
                                            className="radio_alta"
                                        />
                                        <label htmlFor="urgencia_alta">Alta</label>
                                    </span>
                                </div>
                            </div>
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
