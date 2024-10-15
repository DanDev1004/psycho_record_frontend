import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, NavLink } from "react-router-dom";
import "../../assets/styles/Form.css";

import { formatearFecha } from "../../utils/utils";
import { ENDPOINTS } from "../../api/apiEndPoints";

const DetailsDerivacion = () => {
    const { id } = useParams();
    const [derivacion, setDerivacion] = useState(null);
    const [consultaRelacionada, setConsultaRelacionada] = useState(null);

    useEffect(() => {
        const obtenerPorId = async () => {
            try {
                const derivacionResponse = await axios.get(ENDPOINTS.DERIVACION.OBTENER_POR_ID(id));
                setDerivacion(derivacionResponse.data);

                const consultaResponse = await axios.get(ENDPOINTS.DERIVACION.OBTENER_FECHA_CONSULTA(id));
                setConsultaRelacionada(consultaResponse.data);
                
            } catch (error) {
                console.error("Error al obtener la derivación o la consulta relacionada", error);
            }
        };

        obtenerPorId();
    }, [id]);

    if (!derivacion) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="detailsDerivacionps">
            <NavLink to={"/derivaciones"}>
                <button className="btn-regresar">Regresar</button>
            </NavLink>
            <h1 className="title-form">Detalles de la Derivación</h1>
            <div className="contenedor">
                <div className="row">
                    <div className="col-25">
                        <strong>Remitente:</strong>
                    </div>
                    <div className="col-75">
                        {derivacion.USUARIO?.NOMBRE_USUARIO} {derivacion.USUARIO?.APELLIDO_USUARIO}
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <strong>Alumno:</strong>
                    </div>
                    <div className="col-75">
                        {derivacion.ALUMNO?.NOMBRES} {derivacion.ALUMNO?.APELLIDOS} (DNI: {derivacion.ALUMNO?.DNI})
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <strong>Motivo:</strong>
                    </div>
                    <div className="col-75">
                        {derivacion.MOTIVO}
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <strong>Urgencia:</strong>
                    </div>
                    <div className="col-75">
                        {derivacion.URGENCIA === 1
                            ? "Baja"
                            : derivacion.URGENCIA === 2
                            ? "Media"
                            : "Alta"}
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <strong>Estado:</strong>
                    </div>
                    <div className="col-75">
                        {derivacion.RECIBIDO ? "Recibido" : "En espera"}
                    </div>
                </div>

                {consultaRelacionada && (
                    <div className="row">
                        <div className="col-25">
                            <strong>Fecha de Atención:</strong>
                        </div>
                        <div className="col-75">
                            {formatearFecha(consultaRelacionada.fecha_atencion)} | {consultaRelacionada.hora_inicio} - {consultaRelacionada.hora_fin}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailsDerivacion;
