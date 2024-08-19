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

    if (!consulta) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
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
                                : "Instructor"}
                    </div>
                </div>
                {consulta.TIPO_DERIVACION === 1 && consulta.LISTADO_AULA?.ALUMNO && (
                    <div className="row">
                        <div className="col-25">
                            <strong>Alumno:</strong>
                        </div>
                        <div className="col-75">
                            {consulta.LISTADO_AULA.ALUMNO.NOMBRE_ALUMNO} {consulta.LISTADO_AULA.ALUMNO.APELLIDO_ALUMNO} (DNI: {consulta.LISTADO_AULA.ALUMNO.DNI_ALUMNO})
                        </div>
                    </div>
                )}
                {consulta.TIPO_DERIVACION === 2 && consulta.FAMILIAR && (
                    <div className="row">
                        <div className="col-25">
                            <strong>Familiar:</strong>
                        </div>
                        <div className="col-75">
                            {consulta.FAMILIAR.NOMBRE_FAMILIAR}
                        </div>
                    </div>
                )}
                {consulta.TIPO_DERIVACION === 3 && consulta.LISTADO_AULA?.TUTOR?.INSTRUCTOR && (
                    <div className="row">
                        <div className="col-25">
                            <strong>Tutor:</strong>
                        </div>
                        <div className="col-75">
                            {consulta.LISTADO_AULA.TUTOR.INSTRUCTOR.NOMBRE_INSTRUCTOR} {consulta.LISTADO_AULA.TUTOR.INSTRUCTOR.APELLIDO_INSTRUCTOR}
                        </div>
                    </div>
                )}
                <div className="row">
                    <div className="col-25">
                        <strong>Fecha de Atención:</strong>
                    </div>
                    <div className="col-75">
                        {new Date(consulta.FECHA_ATENCION).toLocaleDateString()}
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
                <div className="row">
                    <div className="col-25">
                        <strong>Problema:</strong>
                    </div>
                    <div className="col-75">
                        {consulta.PROBLEMA}
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <strong>Recomendación:</strong>
                    </div>
                    <div className="col-75">
                        {consulta.RECOMENDACION}
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <strong>Aspecto Físico:</strong>
                    </div>
                    <div className="col-75">
                        {consulta.ASPECTO_FISICO}
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <strong>Aseo Personal:</strong>
                    </div>
                    <div className="col-75">
                        {consulta.ASEO_PERSONAL}
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <strong>Conducta:</strong>
                    </div>
                    <div className="col-75">
                        {consulta.CONDUCTA}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsConsultaPs;
