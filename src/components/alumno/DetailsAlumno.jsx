import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, NavLink } from "react-router-dom";
import "../../assets/styles/Form.css";

import { formatearFecha, convertirRomanos, calcularEdad } from '../../utils/utils'
import { ENDPOINTS } from "../../api/apiEndPoints";

const DetailsAlumno = () => {
    const { id } = useParams();
    const [alumno, setAlumno] = useState(null);

    useEffect(() => {
        const obtenerPorId = async () => {
            try {
                const response = await axios.get(ENDPOINTS.ALUMNO.OBTENER_POR_ID(id));
                setAlumno(response.data);
            } catch (error) {
                console.error("Error al obtener el alumno", error);
            }
        };
        obtenerPorId();
    }, [id]);

    if (!alumno) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="detailsAlumno">

            <NavLink to={"/alumnos"}>
                <button className="btn-regresar">Regresar</button>
            </NavLink>

            <h1 className="title-form">Detalles del Alumno</h1>

            <div className="contenedor">

                <div className="row">
                    <div className="col-25">
                        <strong>Nombres:</strong>
                    </div>
                    <div className="col-75" style={{ textTransform: 'uppercase' }}>
                        {alumno.NOMBRES}
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <strong>Apellidos:</strong>
                    </div>
                    <div className="col-75" style={{ textTransform: 'uppercase' }}>
                        {alumno.APELLIDOS}
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <strong>DNI:</strong>
                    </div>
                    <div className="col-75">
                        {alumno.DNI}
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <strong>Sexo:</strong>
                    </div>
                    <div className="col-75">
                        {alumno.SEXO === 'M' ? "Masculino" : "Femenino"}
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <strong>Teléfono:</strong>
                    </div>
                    <div className="col-75">
                        {alumno.TELEFONO || "------------"}
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <strong>Ciclo:</strong>
                    </div>
                    <div className="col-75">
                        {convertirRomanos(alumno.CICLO)}
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <strong>Turno:</strong>
                    </div>
                    <div className="col-75">
                        {alumno.TURNO === 'M' ? "Mañana" : "Tarde"}
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <strong>Programa de estudio:</strong>
                    </div>
                    <div className="col-75">
                        {alumno.AREA_PE ? alumno.AREA_PE.NOMBRE_AREA_PE : "------------"}
                    </div>
                </div>

                <hr style={{opacity:'.4'}}/>

                <div className="row">
                    <div className="col-25">
                        <strong>Dirección Nacional:</strong>
                    </div>
                    <div className="col-75">
                        {alumno.DIR_NAC || "------------"}
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <strong>Fecha de Nacimiento:</strong>
                    </div>
                    <div className="col-75">
                        {formatearFecha(alumno.FECH_NAC) || "------------"}
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <strong>Edad:</strong>
                    </div>
                    <div className="col-75">
                        {calcularEdad(alumno.FECH_NAC) || "------------"}
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <strong>Domicilio:</strong>
                    </div>
                    <div className="col-75">
                        {alumno.DOMICILIO || "------------"}
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <strong>Estado Civil:</strong>
                    </div>
                    <div className="col-75">
                        {alumno.ESTADO_CIVIL ? alumno.ESTADO_CIVIL.NOMBRE_EC : "------------"}
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <strong>Religión:</strong>
                    </div>
                    <div className="col-75">
                        {alumno.RELIGION ? alumno.RELIGION.NOMBRE_RELIGION : "------------"}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DetailsAlumno;
