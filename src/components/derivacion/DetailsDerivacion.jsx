import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, NavLink } from "react-router-dom";
import {
    trashOutline,
    createOutline
} from "ionicons/icons";
import "../../assets/styles/Form.css";

const DetailsDerivacion = () => {
    const { id } = useParams();
    const [derivacion, setDerivacion] = useState(null);
    const [consultaRelacionada, setConsultaRelacionada] = useState(null);

    useEffect(() => {
        const obtenerDerivacion = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/derivacion/${id}`);
                setDerivacion(response.data);
    

                const consultaResponse = await axios.get(`http://localhost:5000/consulta`);
                
                const consultasDerivacion = consultaResponse.data.filter(
                    consulta => consulta.TIPO_DERIVACION === 3
                );
                
                const consultaRelacionada = consultasDerivacion.find(
                    consulta => consulta.DERIVACION && consulta.DERIVACION.ID_DERIVACION === response.data.ID_DERIVACION
                );
    
                setConsultaRelacionada(consultaRelacionada);
    
            } catch (error) {
                console.error("Error al obtener la derivación o la consulta relacionada", error);
            }
        };
    
        obtenerDerivacion();
    }, [id]);

    const formatearFecha = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate() + 1).padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

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
                            {formatearFecha(consultaRelacionada.FECHA_ATENCION)} {consultaRelacionada.HORA_INICIO} {consultaRelacionada.HORA_FIN}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailsDerivacion;
