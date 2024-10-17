import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import "../../assets/styles/Form.css";
import { ENDPOINTS } from "../../api/apiEndPoints";
import { convertirRomanos } from "../../utils/utils"; 

const FormAddConsultasPs = () => {
    const { user } = useSelector((state) => state.auth);
    const [alumnos, setAlumnos] = useState([]);
    const [derivaciones, setDerivaciones] = useState([]);
    const [tipoDerivacion, setTipoDerivacion] = useState(1);

    const [alumno, setAlumno] = useState(null);
    const [alumnoDerivFam, setAlumnoDerivFam] = useState(null);
    const [nombreFamiliar, setNombreFamiliar] = useState("");
    const [telefonoFamiliar, setTelefonoFamiliar] = useState("");
    const [parentescoFamiliar, setParentescoFamiliar] = useState("");
    const [derivacion, setDerivacion] = useState("");
    const [areasPe, setAreasPe] = useState([]); 
    const [areaEstudio, setAreaEstudio] = useState("");
    const [ciclo, setCiclo] = useState("");

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
    const { idAlumno, id } = useParams();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const alumnosResponse = await axios.get(ENDPOINTS.ALUMNO.OBTENER_TODOS);
                const derivacionesResponse = await axios.get(ENDPOINTS.DERIVACION.OBTENER_TODOS);

                const alumnosOptions = alumnosResponse.data.map(alumno => ({
                    value: alumno.ID_ALUMNO,
                    label: `${alumno.NOMBRES} ${alumno.APELLIDOS} - ${alumno?.AREA_PE.NOMBRE_AREA_PE} - ${alumno.CICLO}`,
                    areaEstudio: alumno.AREA_PE.ID_AREA_PE,
                    ciclo: alumno.CICLO
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

                if (id) {
                    setTipoDerivacion(3);
                    setDerivacion(parseInt(id));

                    const derivacionSeleccionada = derivacionesResponse.data.find(
                        (deriv) => deriv.ID_DERIVACION === parseInt(id)
                    );

                    if (derivacionSeleccionada) {
                        const alumnoSeleccionado = alumnosOptions.find(
                            (alumno) => alumno.value === derivacionSeleccionada.ID_ALUMNO
                        );

                        if (alumnoSeleccionado) {
                            setAlumno(alumnoSeleccionado);
                        }

                        setMotivo(derivacionSeleccionada.MOTIVO);
                    }
                }

            } catch (error) {
                console.error("Error al cargar datos", error);
            }
        };

        cargarDatos();
        cargarAreasPe();
    }, [idAlumno, id]);

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

    const tipoDerivacionCambio = (e) => {
        setTipoDerivacion(parseInt(e.target.value));
        setAlumno(null);
        setAlumnoDerivFam(null);
        setNombreFamiliar("");
        setTelefonoFamiliar("");
        setParentescoFamiliar("");
        setDerivacion("");
        setMotivo("");
        setAreaEstudio("");
        setCiclo("");
    };

    const derivacionCambio = (e) => {
        const selectedDerivacionId = parseInt(e.target.value);
        setDerivacion(selectedDerivacionId);

        const derivacionSeleccionada = derivaciones.find(
            (deriv) => deriv.ID_DERIVACION === selectedDerivacionId
        );

        if (derivacionSeleccionada) {
            setMotivo(derivacionSeleccionada.MOTIVO);

            const alumnoSeleccionado = alumnos.find(
                (alumno) => alumno.value === derivacionSeleccionada.ID_ALUMNO
            );
            if (alumnoSeleccionado) {
                setAlumno(alumnoSeleccionado);
            }
        } else {
            setMotivo("");
            setAlumno(null);
        }
    };

    const ciclosOptions = [
        { value: 1, label: convertirRomanos(1) },
        { value: 2, label: convertirRomanos(2) },
        { value: 3, label: convertirRomanos(3) },
        { value: 4, label: convertirRomanos(4) },
        { value: 5, label: convertirRomanos(5) },
        { value: 6, label: convertirRomanos(6) },
    ];

    const alumnosFiltrados = alumnos.filter((alumno) =>
        (areaEstudio ? alumno.areaEstudio === areaEstudio : true) &&
        (ciclo ? alumno.ciclo === ciclo : true)
    );

    const crear = async (e) => {
        e.preventDefault();
        const familiarInfo = `${nombreFamiliar}|${telefonoFamiliar}|${parentescoFamiliar}`;
        try {
            await axios.post(ENDPOINTS.CONSULTAPS.CREAR, {
                ID_USUARIO: user?.ID_USUARIO,
                TIPO_DERIVACION: tipoDerivacion,
                ID_ALUMNO: tipoDerivacion === 1 ? alumno?.value : tipoDerivacion === 2 ? alumnoDerivFam?.value : tipoDerivacion === 3 ? alumno?.value : "",
                FAMILIAR: tipoDerivacion === 2 ? familiarInfo : "",
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
                <form onSubmit={crear}>
                    <p className="msg">{msg}</p>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Tipo de Derivación</label>
                        </div>
                        <div className="col-75">
                            <select
                                className="input-form"
                                value={tipoDerivacion}
                                onChange={tipoDerivacionCambio}
                                disabled={!!idAlumno || !!id}
                                required
                            >
                                <option value={1}>Autónomo</option>
                                <option value={2}>Pariente</option>
                                <option value={3}>Tutor</option>
                            </select>
                        </div>
                    </div>



                    {tipoDerivacion === 1 && (
                        <>
                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Área de Estudio</label>
                                </div>
                                <div className="col-75">
                                    <Select
                                        options={areasPe}
                                        value={areasPe.find((area) => area.value === areaEstudio)}
                                        onChange={(selectedOption) => setAreaEstudio(selectedOption?.value || "")}
                                        className="input-form"
                                        placeholder="Seleccionar área"
                                        isClearable
                                        isDisabled={!!idAlumno}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Ciclo</label>
                                </div>
                                <div className="col-75">
                                    <Select
                                        options={ciclosOptions}
                                        value={ciclosOptions.find((cicloOption) => cicloOption.value === ciclo)}
                                        onChange={(selectedOption) => setCiclo(selectedOption?.value || "")}
                                        className="input-form"
                                        placeholder="Seleccionar ciclo"
                                        isClearable
                                        isDisabled={!!idAlumno}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Alumno</label>
                                </div>
                                <div className="col-75">
                                    <Select
                                        options={alumnosFiltrados}
                                        value={alumno}
                                        onChange={setAlumno}
                                        className="input-form"
                                        placeholder="Seleccionar alumno"
                                        isDisabled={!!idAlumno}
                                        required
                                        isClearable
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {tipoDerivacion === 2 && (
                        <>
                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Nombre Familiar</label>
                                </div>
                                <div className="col-75">
                                    <input
                                        type="text"
                                        className="input-form"
                                        value={nombreFamiliar}
                                        onChange={(e) => setNombreFamiliar(e.target.value)}
                                        placeholder="Ingrese nombres y apellidos del familiar"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Teléfono Familiar</label>
                                </div>
                                <div className="col-75">
                                    <input
                                        type="text"
                                        className="input-form"
                                        value={telefonoFamiliar}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            //regex
                                            if (/^\d{0,9}$/.test(value)) {
                                                setTelefonoFamiliar(value);
                                            }
                                        }}
                                        placeholder="Ingrese el teléfono del familiar"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Parentesco</label>
                                </div>
                                <div className="col-75">
                                    <select
                                        className="input-form"
                                        value={parentescoFamiliar}
                                        onChange={(e) => setParentescoFamiliar(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccionar parentesco</option>
                                        <option value="Padre">Padre</option>
                                        <option value="Madre">Madre</option>
                                        <option value="Hermano/a">Hermano/a</option>
                                        <option value="Abuelo/a">Abuelo/a</option>
                                        <option value="Tío/a">Tío/a</option>
                                        <option value="Primo/a">Primo/a</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Área de Estudio</label>
                                </div>
                                <div className="col-75">
                                    <Select
                                        options={areasPe}
                                        value={areasPe.find((area) => area.value === areaEstudio)}
                                        onChange={(selectedOption) => setAreaEstudio(selectedOption?.value || "")}
                                        className="input-form"
                                        placeholder="Seleccionar área"
                                        isClearable
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Ciclo</label>
                                </div>
                                <div className="col-75">
                                    <Select
                                        options={ciclosOptions}
                                        value={ciclosOptions.find((cicloOption) => cicloOption.value === ciclo)}
                                        onChange={(selectedOption) => setCiclo(selectedOption?.value || "")}
                                        className="input-form"
                                        placeholder="Seleccionar ciclo"
                                        isClearable
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-25">
                                    <label className="label-form">Alumno</label>
                                </div>
                                <div className="col-75">
                                    <Select
                                        options={alumnosFiltrados}
                                        value={alumnoDerivFam}
                                        onChange={setAlumnoDerivFam}
                                        className="input-form"
                                        placeholder="Seleccionar alumno"
                                        required
                                        isClearable
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
                                    onChange={derivacionCambio}
                                    disabled={!!id}
                                    required
                                >
                                    <option value="">Seleccionar Derivación</option>
                                    {derivaciones
                                        .filter((deriv) => deriv.ESTADO === true)
                                        .filter((deriv) => deriv.RECIBIDO === false)
                                        .map((deriv) => (
                                            <option key={deriv.ID_DERIVACION} value={deriv.ID_DERIVACION}>
                                                {deriv.USUARIO.NOMBRE_USUARIO} {deriv.USUARIO.APELLIDO_USUARIO} - {deriv.ALUMNO?.NOMBRES} {deriv.ALUMNO?.APELLIDOS} -
                                                {` Urgencia: ${deriv.URGENCIA === 1 ? ' Baja' : deriv.URGENCIA === 2 ? ' Media' : ' Alta'}`}
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

                    <div className="row asistencia">
                        <div className="col-25">
                            <label className="label-form">Asistencia</label>
                        </div>

                        <div className="col-75 caja-radio-button">
                            <div className="opciones-radio">
                                <div className="form-group asistencia-group">
                                    <span className="opcion-radio">
                                        <input
                                            type="radio"
                                            id="urgencia_baja"
                                            name="asistencia"
                                            value="1"
                                            checked={asistencia === 1}
                                            onChange={(e) => setAsistencia(Number(e.target.value))}
                                            className="radio_azul"
                                        />
                                        <label htmlFor="urgencia_baja">Pendiente</label>
                                    </span>

                                    <span className="opcion-radio">
                                        <input
                                            type="radio"
                                            id="urgencia_media"
                                            name="asistencia"
                                            value="2"
                                            checked={asistencia === 2}
                                            onChange={(e) => setAsistencia(Number(e.target.value))}
                                            className="radio_azul"
                                        />
                                        <label htmlFor="urgencia_media">Asistido</label>
                                    </span>
                                </div>
                            </div>
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
