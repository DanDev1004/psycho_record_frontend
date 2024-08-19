import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "../../assets/styles/Form.css";  

const FormEditConsultasPs = () => {
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
                const consulta = consultaResponse.data;

                setFechaAtencion(formatDate(consulta.FECHA_ATENCION));
                setHoraInicio(consulta.HORA_INICIO);
                setHoraFin(consulta.HORA_FIN);
                setAsistencia(consulta.ASISTENCIA);
                setMotivo(consulta.MOTIVO);
                setProblema(consulta.PROBLEMA);
                setRecomendacion(consulta.RECOMENDACION);
                setAspectoFisico(consulta.ASPECTO_FISICO);
                setAseoPersonal(consulta.ASEO_PERSONAL);
                setConducta(consulta.CONDUCTA);
            } catch (error) {
                console.error("Error al cargar datos", error);
            }
        };

        cargarDatos();
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
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
                PROBLEMA: problema,
                RECOMENDACION: recomendacion,
                ASPECTO_FISICO: aspectoFisico,
                ASEO_PERSONAL: aseoPersonal,
                CONDUCTA: conducta,
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
                                onChange={(e) => setAsistencia(e.target.value)}
                                required
                            >
                                <option value={1}>Pendiente</option>
                                <option value={2}>Asistido</option>
                                <option value={3}>No Asistido</option>
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
                            />
                        </div>
                    </div>

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

                    <div className="row">
                        <button className="button-form" type="submit">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormEditConsultasPs;
