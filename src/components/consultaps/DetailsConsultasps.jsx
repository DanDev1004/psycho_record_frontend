import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, NavLink } from "react-router-dom";
import "../../assets/styles/Form.css";

const DetailsConsultaPs = () => {
    const { id } = useParams();
    const [consulta, setConsulta] = useState(null);

    useEffect(() => {
        const obtenerConsulta = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/consulta/${id}`);
                setConsulta(response.data);
            } catch (error) {
                console.error("Error al obtener la consulta", error);
            }
        };

        obtenerConsulta();
    }, [id]);

    const formatearFecha = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate() + 1).padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    if (!consulta) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="detailsConsultasps">
            <NavLink to={"/consultasps"}>
                <button className="btn-regresar">Regresar</button>
            </NavLink>
            <h1 className="title-form">Detalles de la Consulta Psicológica</h1>
            <div className="contenedor">
                <div className="row">
                    <div className="col-25">
                        <strong>Usuario:</strong>
                    </div>
                    <div className="col-75">
                        {consulta.USUARIO?.NOMBRE_USUARIO} {consulta.USUARIO?.APELLIDO_USUARIO}
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <strong>Tipo de Derivación:</strong>
                    </div>
                    <div className="col-75">
                        {consulta.TIPO_DERIVACION === 1
                            ? "Autónomo"
                            : consulta.TIPO_DERIVACION === 2
                                ? "Pariente"
                                : "Docente"
                        }
                    </div>
                </div>
                {consulta.TIPO_DERIVACION === 1 && consulta.ALUMNO && (
                    <div className="row">
                        <div className="col-25">
                            <strong>Alumno:</strong>
                        </div>
                        <div className="col-75">
                            {consulta.ALUMNO.NOMBRES} {consulta.ALUMNO.APELLIDOS} (DNI: {consulta.ALUMNO.DNI})
                        </div>
                    </div>
                )}
                {consulta.TIPO_DERIVACION === 2 && consulta.FAMILIAR && (
                    <>
                        <div className="row">
                            <div className="col-25">
                                <strong>Alumno:</strong>
                            </div>
                            <div className="col-75">
                                {consulta.ALUMNO.NOMBRES} {consulta.ALUMNO.APELLIDOS} (DNI: {consulta.ALUMNO.DNI})
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-25">
                                <strong>Familiar:</strong>
                            </div>
                            <div className="col-75">
                                {consulta.FAMILIAR}
                            </div>
                        </div>
                    </>
                )}
                {consulta.TIPO_DERIVACION === 3 && consulta?.DERIVACION.USUARIO && (
                    <>
                        <div className="row">
                            <div className="col-25">
                                <strong>Alumno:</strong>
                            </div>
                            <div className="col-75">
                                {consulta.ALUMNO.NOMBRES} {consulta.ALUMNO.APELLIDOS} (DNI: {consulta.ALUMNO.DNI})
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-25">
                                <strong>Tutor:</strong>
                            </div>
                            <div className="col-75">
                                {consulta.DERIVACION.USUARIO.NOMBRE_USUARIO} {consulta.DERIVACION.USUARIO.APELLIDO_USUARIO}
                            </div>
                        </div>
                    </>
                )}
                <div className="row">
                    <div className="col-25">
                        <strong>Fecha de Atención:</strong>
                    </div>
                    <div className="col-75">
                        {formatearFecha(consulta.FECHA_ATENCION)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <strong>Hora de Inicio:</strong>
                    </div>
                    <div className="col-75">
                        {consulta.HORA_INICIO}
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <strong>Hora de Fin:</strong>
                    </div>
                    <div className="col-75">
                        {consulta.HORA_FIN}
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <strong>Asistencia:</strong>
                    </div>
                    <div className="col-75">
                        {consulta.ASISTENCIA === 1
                            ? "Pendiente"
                            : consulta.ASISTENCIA === 2
                                ? "Asistido"
                                : "No asistido"}
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <strong>Motivo:</strong>
                    </div>
                    <div className="col-75">
                        {consulta.MOTIVO}
                    </div>
                </div>




                {consulta.PROBLEMA && (
                    <div className="row">
                        <div className="col-25">
                            <strong>Problema:</strong>
                        </div>
                        <div className="col-75">
                            {consulta.PROBLEMA}
                        </div>
                    </div>
                )}

                {consulta.RECOMENDACION && (
                    <div className="row">
                        <div className="col-25">
                            <strong>Recomendación:</strong>
                        </div>
                        <div className="col-75">
                            {consulta.RECOMENDACION}
                        </div>
                    </div>
                )}

                {consulta.ASPECTO_FISICO && (
                    <div className="row">
                        <div className="col-25">
                            <strong>Aspecto Físico:</strong>
                        </div>
                        <div className="col-75">
                            {consulta.ASPECTO_FISICO}
                        </div>
                    </div>
                )}

                {consulta.ASEO_PERSONAL && (
                    <div className="row">
                        <div className="col-25">
                            <strong>Aseo Personal:</strong>
                        </div>
                        <div className="col-75">
                            {consulta.ASEO_PERSONAL}
                        </div>
                    </div>
                )}

                {consulta.CONDUCTA && (
                    <div className="row">
                        <div className="col-25">
                            <strong>Conducta:</strong>
                        </div>
                        <div className="col-75">
                            {consulta.CONDUCTA}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailsConsultaPs;
