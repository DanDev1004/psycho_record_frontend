import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "../../assets/styles/Form.css";

const FormEditConsultasPs = () => {
    const [consulta, setConsulta] = useState(null);
    const [alumno, setAlumno] = useState("");
    const [tutor, setTutor] = useState("");
    const [fechaAtencion, setFechaAtencion] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [asistencia, setAsistencia] = useState(1);
    const [motivo, setMotivo] = useState("");
    const [problema, setProblema] = useState("");
    const [recomendacion, setRecomendacion] = useState("");
    const [aspectoFisico, setAspectoFisico] = useState("");
    const [aseoPersonal, setAseoPersonal] = useState("");
    const [conducta, setConducta] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const consultaResponse = await axios.get(`http://localhost:5000/consulta/${id}`);
                const consultaData = consultaResponse.data;

                setConsulta(consultaData);
                setFechaAtencion(formatearFecha(consultaData.FECHA_ATENCION));
                setHoraInicio(consultaData.HORA_INICIO);
                setHoraFin(consultaData.HORA_FIN);
                setAsistencia(consultaData.ASISTENCIA);
                setMotivo(consultaData.MOTIVO);
                setProblema(consultaData.PROBLEMA);
                setRecomendacion(consultaData.RECOMENDACION);
                setAspectoFisico(consultaData.ASPECTO_FISICO);
                setAseoPersonal(consultaData.ASEO_PERSONAL);
                setConducta(consultaData.CONDUCTA);

                if (consultaData.TIPO_DERIVACION === 1 || consultaData.TIPO_DERIVACION === 2) {
                    setAlumno(`${consultaData.ALUMNO.NOMBRES} ${consultaData.ALUMNO.APELLIDOS}`);
                    setTutor(`${consultaData.USUARIO.NOMBRE_USUARIO} ${consultaData.DERIVACION.USUARIO.APELLIDO_USUARIO}`);
                }

                if (consultaData.TIPO_DERIVACION === 3) {
                    setAlumno(`${consultaData.ALUMNO.NOMBRES} ${consultaData.ALUMNO.APELLIDOS}`);
                    setTutor(`${consultaData.DERIVACION.USUARIO.NOMBRE_USUARIO} ${consultaData.DERIVACION.USUARIO.APELLIDO_USUARIO}`);
                }
            } catch (error) {
                console.error("Error al cargar datos", error);
            }
        };

        cargarDatos();
    }, [id]);

    const formatearFecha = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate() + 1).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const actualizarConsulta = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/consulta/${id}`, {
                FECHA_ATENCION: fechaAtencion,
                HORA_INICIO: horaInicio,
                HORA_FIN: horaFin,
                ASISTENCIA: asistencia,
                MOTIVO: motivo,
                PROBLEMA: asistencia === 2 ? problema : "",
                RECOMENDACION: asistencia === 2 ? recomendacion : "",
                ASPECTO_FISICO: asistencia === 2 ? aspectoFisico : "",
                ASEO_PERSONAL: asistencia === 2 ? aseoPersonal : "",
                CONDUCTA: asistencia === 2 ? conducta : "",
            });
            navigate("/consultasps");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <div>
            <NavLink to={"/consultasps"}>
                <button className="btn-regresar">Regresar</button>
            </NavLink>
            <h1 className="title-form">Editar Consulta Psicológica</h1>
            <div className="contenedor">
                <form onSubmit={actualizarConsulta}>
                    <p className="msg">{msg}</p>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Alumno: </label>
                        </div>
                        <div className="col-75">
                            <input
                                type="text"
                                className="input-form"
                                value={alumno}
                                readOnly
                                style={{ border: "none", pointerEvents: "none" }}
                            />
                        </div>
                    </div>

                    {consulta?.TIPO_DERIVACION === 3 && (
                        <div className="row">
                        <div className="col-25">
                            <label className="label-form">Tutor: </label>
                        </div>
                        <div className="col-75">
                            <input
                                type="text"
                                className="input-form"
                                value={tutor}
                                readOnly
                                style={{ border: "none", pointerEvents: "none" }}
                            />
                        </div>
                    </div>
                    )}

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Fecha de Atención</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="date"
                                value={fechaAtencion}
                                onChange={(e) => setFechaAtencion(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Hora de Inicio</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="time"
                                value={horaInicio}
                                onChange={(e) => setHoraInicio(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Hora de Fin</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="time"
                                value={horaFin}
                                onChange={(e) => setHoraFin(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Asistencia</label>
                        </div>
                        <div className="col-75">
                            <select
                                className="input-form"
                                value={asistencia}
                                onChange={(e) => setAsistencia(parseInt(e.target.value))}
                                required
                            >
                                <option value={1}>Pendiente</option>
                                <option value={2}>Asistido</option>
                            </select>
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

                    {asistencia === 2 && (
                        <>
                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Problema</label>
                                </div>
                                <div className="col-75">
                                    <textarea
                                        className="input-form"
                                        value={problema}
                                        onChange={(e) => setProblema(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Recomendación</label>
                                </div>
                                <div className="col-75">
                                    <textarea
                                        className="input-form"
                                        value={recomendacion}
                                        onChange={(e) => setRecomendacion(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Aspecto Físico</label>
                                </div>
                                <div className="col-75">
                                    <textarea
                                        className="input-form"
                                        value={aspectoFisico}
                                        onChange={(e) => setAspectoFisico(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Aseo Personal</label>
                                </div>
                                <div className="col-75">
                                    <textarea
                                        className="input-form"
                                        value={aseoPersonal}
                                        onChange={(e) => setAseoPersonal(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Conducta</label>
                                </div>
                                <div className="col-75">
                                    <textarea
                                        className="input-form"
                                        value={conducta}
                                        onChange={(e) => setConducta(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="row">
                        <button className="button-form" type="submit">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormEditConsultasPs;
