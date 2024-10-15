import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, NavLink, Link } from "react-router-dom";
import "../../assets/styles/Form.css";
import { IonIcon } from '@ionic/react';
import {
    trashOutline
} from "ionicons/icons";
import { ENDPOINTS } from "../../api/apiEndPoints";
import { formatearFecha } from "../../utils/utils";

const DetailsConsultaPs = () => {
    const { id } = useParams();
    const [consulta, setConsulta] = useState(null);
    const [diagnosticos, setDiagnosticos] = useState([]);

    useEffect(() => {
        obtenerConsulta();
        obtenerDiagnosticos();
    }, [id]);

    const obtenerConsulta = async () => {
        try {
            const response = await axios.get(ENDPOINTS.CONSULTAPS.OBTENER_POR_ID(id));
            setConsulta(response.data);
        } catch (error) {
            console.error("Error al obtener la consulta", error);
        }
    };

    const obtenerDiagnosticos = async () => {
        try {
            const response = await axios.get(ENDPOINTS.DIAGNOSTICO.OBTENER_POR_CONSULTA(id));
            setDiagnosticos(response.data.reverse());
        } catch (error) {
            console.error("Error al obtener los diagnósticos", error);
        }
    };

    const eliminarDiagnostico = async (diagnosticoId) => {
        const confirmacion = window.confirm("¿Estás seguro de eliminar este diagnóstico?");
        if (confirmacion) {
            try {
                await axios.delete(ENDPOINTS.DIAGNOSTICO.ELIMINAR(diagnosticoId));
                obtenerDiagnosticos()
            } catch (error) {
                console.error("Error al eliminar el diagnóstico", error);
            }
        }
    };

    if (!consulta) {
        return <div>Cargando...</div>;
    }

    return (
        <>
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
                            <strong>Derivación:</strong>
                        </div>
                        <div className="col-75">
                            {consulta.TIPO_DERIVACION === 1
                                ? "Autónomo"
                                : consulta.TIPO_DERIVACION === 2
                                    ? "Pariente"
                                    : "Docente"}
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-25">
                            <strong>Alumno:</strong>
                        </div>
                        <div className="col-75">
                            {consulta.ALUMNO.NOMBRES} {consulta.ALUMNO.APELLIDOS} (DNI: {consulta.ALUMNO.DNI})
                        </div>
                    </div>


                    {consulta.TIPO_DERIVACION === 2 && consulta.FAMILIAR && (
                        <div className="row">
                            <div className="col-25">
                                <strong>Derivado por:</strong>
                            </div>
                            <div className="col-75">
                                {consulta.FAMILIAR}
                            </div>
                        </div>
                    )}

                    {consulta.TIPO_DERIVACION === 3 && consulta.DERIVACION && consulta.DERIVACION.USUARIO && (
                        <div className="row">
                            <div className="col-25">
                                <strong>Derivado por:</strong>
                            </div>
                            <div className="col-75">
                                {consulta.DERIVACION.USUARIO.NOMBRE_USUARIO} {consulta.DERIVACION.USUARIO.APELLIDO_USUARIO}
                            </div>
                        </div>
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

                    <div className="row" >
                        <div className="col-25">
                            <strong>Motivo:</strong>
                        </div>
                        <div className="col-75">
                            {consulta.MOTIVO}
                        </div>
                    </div>

                    {consulta.PROBLEMA && (
                        <div className="row" style={{ borderTop: '1px solid #c8c8c8', borderBottom: '1px solid #c8c8c8' }}>
                            <div className="col-25">
                                <strong>Problema:</strong>
                            </div>
                            <div className="col-75">
                                {consulta.PROBLEMA}
                            </div>
                        </div>
                    )}

                    {consulta.RECOMENDACION && (
                        <div className="row" style={{ borderBottom: '1px solid #c8c8c8' }}>
                            <div className="col-25">
                                <strong>Recomendación:</strong>
                            </div>
                            <div className="col-75">
                                {consulta.RECOMENDACION}
                            </div>
                        </div>
                    )}

                    {consulta.ASPECTO_FISICO && (
                        <div className="row" style={{ borderBottom: '1px solid #c8c8c8' }}>
                            <div className="col-25">
                                <strong>Aspecto Físico:</strong>
                            </div>
                            <div className="col-75">
                                {consulta.ASPECTO_FISICO}
                            </div>
                        </div>
                    )}

                    {consulta.ASEO_PERSONAL && (
                        <div className="row" style={{ borderBottom: '1px solid #c8c8c8' }}>
                            <div className="col-25">
                                <strong>Aseo Personal:</strong>
                            </div>
                            <div className="col-75">
                                {consulta.ASEO_PERSONAL}
                            </div>
                        </div>
                    )}

                    {consulta.CONDUCTA && (
                        <div className="row" >
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

            {consulta.ASISTENCIA === 2 && (
                <div className="recentTable">
                    <div className="TableHeader">
                        <h2>Diagnósticos Relacionados</h2>
                        <Link to={`/diagnostico/add/${id}`} className="btn">
                            Diagnosticar
                        </Link>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Condición</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {diagnosticos.map((diagnostico, index) => (
                                <tr key={diagnostico.ID_DIAGNOSTICO}>
                                    <td>{diagnosticos.length - index}</td>
                                    <td>{diagnostico.CONDICION?.NOMBRE_CONDICION || 'No especificada'}</td>
                                    <td>{diagnostico.DESCRIPCION || 'Sin descripción'}</td>
                                    <td>

                                        <Link className="btn-delete" onClick={() => eliminarDiagnostico(diagnostico.ID_DIAGNOSTICO)}>
                                            <IonIcon icon={trashOutline} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default DetailsConsultaPs;
