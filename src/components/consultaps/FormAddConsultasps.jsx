import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";  
import "../../assets/styles/Form.css";

const FormAddConsultasPs = () => {
    const { user } = useSelector((state) => state.auth);
    const [alumnos, setAlumnos] = useState([]);
    const [derivaciones, setDerivaciones] = useState([]);
    const [tipoDerivacion, setTipoDerivacion] = useState(1);

    const [alumno, setAlumno] = useState(null);  
    const [alumnoDerivFam, setAlumnoDerivFam] = useState(null);  
    const [familiar, setFamiliar] = useState("");
    const [derivacion, setDerivacion] = useState("");

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
    const { idAlumno } = useParams();
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const alumnosResponse = await axios.get("http://localhost:5000/alumno");
                const derivacionesResponse = await axios.get("http://localhost:5000/derivacion");

                const alumnosOptions = alumnosResponse.data.map(alumno => ({
                    value: alumno.ID_ALUMNO,
                    label: `${alumno.NOMBRES} ${alumno.APELLIDOS} - ${alumno?.AREA_PE.NOMBRE_AREA_PE}`,
                }));

                setAlumnos(alumnosOptions);
                setDerivaciones(derivacionesResponse.data);

                if (idAlumno) {
                    const alumnoSeleccionado = alumnosOptions.find(
                        (alumno) => alumno.value === parseInt(idAlumno)
                    );
                    if (alumnoSeleccionado) {
                        setAlumno(alumnoSeleccionado);
                    }
                }
            } catch (error) {
                console.error("Error al cargar datos", error);
            }
        };

        cargarDatos();
    }, [idAlumno]);

    useEffect(() => {
        if (tipoDerivacion === 3 && derivacion) {
            const derivacionSeleccionada = derivaciones.find(
                (deriv) => deriv.ID_DERIVACION === parseInt(derivacion)
            );
            if (derivacionSeleccionada) {
                const alumnoSeleccionado = alumnos.find(
                    (alumno) => alumno.value === derivacionSeleccionada.ID_ALUMNO
                );

                if (alumnoSeleccionado) {
                    setAlumno(alumnoSeleccionado);
                }

                setMotivo(derivacionSeleccionada.MOTIVO);
            }
        } else if (tipoDerivacion === 3) {
            setAlumno(null);
            setMotivo("");
        }
    }, [tipoDerivacion, derivacion, derivaciones, alumnos]);

    const handleTipoDerivacionChange = (e) => {
        setTipoDerivacion(parseInt(e.target.value));
        setAlumno(null);
        setAlumnoDerivFam(null);
        setFamiliar("");
        setDerivacion("");
    };

    const handleAsistenciaChange = (e) => {
        setAsistencia(parseInt(e.target.value));
    };

    const guardarConsulta = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/consulta", {
                ID_USUARIO: user?.ID_USUARIO,
                TIPO_DERIVACION: tipoDerivacion,
                ID_ALUMNO: tipoDerivacion === 1 ? alumno?.value : tipoDerivacion === 2 ? alumnoDerivFam?.value : tipoDerivacion === 3 ? alumno?.value : "",
                FAMILIAR: tipoDerivacion === 2 ? familiar : "",
                ID_DERIVACION: tipoDerivacion === 3 ? derivacion : null,
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

            <h1 className="title-form">Agregar Consulta Psicológica</h1>

            <div className="contenedor">
                <form onSubmit={guardarConsulta}>
                    <p className="msg">{msg}</p>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Tipo de Derivación</label>
                        </div>
                        <div className="col-75">
                            <select
                                className="input-form"
                                value={tipoDerivacion}
                                onChange={handleTipoDerivacionChange}
                                disabled={!!idAlumno} 
                                required
                            >
                                <option value={1}>Autónomo</option>
                                <option value={2}>Pariente</option>
                                <option value={3}>Tutor</option>
                            </select>
                        </div>
                    </div>

                    {tipoDerivacion === 1 && (
                        <div className="row">
                            <div className="col-25">
                                <label className="label-form">Alumno</label>
                            </div>
                            <div className="col-75">
                                <Select
                                    options={alumnos}
                                    value={alumno}
                                    onChange={setAlumno}
                                    className="input-form"
                                    placeholder="Seleccionar alumno"
                                    isDisabled={!!idAlumno} 
               
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {tipoDerivacion === 2 && (
                        <>
                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Familiar</label>
                                </div>
                                <div className="col-75">
                                    <input
                                        type="text"
                                        className="input-form"
                                        value={familiar}
                                        onChange={(e) => setFamiliar(e.target.value)}
                                        placeholder="Ingrese nombres y apellidos del familiar"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Alumno</label>
                                </div>
                                <div className="col-75">
                                    <Select
                                        options={alumnos}
                                        value={alumnoDerivFam}
                                        onChange={setAlumnoDerivFam}
                                        className="input-form"
                                        placeholder="Seleccionar alumno"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {tipoDerivacion === 3 && (
                        <div className="row">
                            <div className="col-25">
                                <label className="label-form">Derivación</label>
                            </div>
                            <div className="col-75">
                                <select
                                    className="input-form"
                                    value={derivacion}
                                    onChange={(e) => setDerivacion(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccionar Derivación</option>
                                    {derivaciones
                                        .filter((deriv) => deriv.ESTADO === true)
                                        .filter((deriv) => deriv.RECIBIDO === false)
                                        .map((deriv) => (
                                            <option key={deriv.ID_DERIVACION} value={deriv.ID_DERIVACION}>
                                                {deriv.USUARIO.NOMBRE_USUARIO} {deriv.USUARIO.APELLIDO_USUARIO} - {deriv.ALUMNO?.NOMBRES} {deriv.ALUMNO?.APELLIDOS} -
                                                {` Urgencia: ${deriv.URGENCIA === 1
                                                    ? ' Baja'
                                                    : deriv.URGENCIA === 2
                                                        ? ' Media'
                                                        : ' Alta'
                                                    }`}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    )}

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
                                onChange={handleAsistenciaChange}
                                required
                            >
                                <option value={1}>Pendiente</option>
                                <option value={2}>Asistido</option>
                            </select>
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
                        <button className="button-form" type="submit">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormAddConsultasPs;
