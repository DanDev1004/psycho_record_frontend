import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
  radioOutline,
  heartCircleOutline,
  createOutline
} from "ionicons/icons";
import { ENDPOINTS } from "../api/apiEndPoints";
import "../assets/styles/dashboard.css";
import { formatearFecha } from "../utils/utils";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const [consultasPendientes, setConsultasPendientes] = useState([]);
  const [derivacionesPendientes, setDerivacionesPendientes] = useState([]);

  useEffect(() => {
    obtenerConsultasPendientes();
    obtenerDerivacionesPendientes();
  }, []);

  const obtenerConsultasPendientes = async () => {
    try {
      const response = await axios.get(ENDPOINTS.CONSULTAPS.OBTENER_TODOS);
      const pendientes = response.data.filter(consulta => consulta.ASISTENCIA === 1);
      setConsultasPendientes(pendientes.reverse());
    } catch (error) {
      console.error("Error al obtener las consultas", error);
    }
  };

  const obtenerDerivacionesPendientes = async () => {
    try {
      const response = await axios.get(ENDPOINTS.DERIVACION.OBTENER_TODOS);
      const derivacionesNoRecibidas = response.data.filter(derivacion => derivacion.RECIBIDO === false);
      setDerivacionesPendientes(derivacionesNoRecibidas.reverse());
    } catch (error) {
      console.error("Error al obtener las derivaciones", error);
    }
  };

  const getUrgenciaEmoji = (urgencia) => {
    switch (urgencia) {
      case 1:
        return "🟢";
      case 2:
        return "🟡";
      case 3:
        return "🔴";
      default:
        return "⚪";
    }
  };

  return (
    <>
      <div className="bienvenida">
        <h1>Bienvenido</h1>
        <h2>
          <strong style={{ textTransform: 'capitalize' }}>
            {user && user.NOMBRE_USUARIO} {user && user.APELLIDO_USUARIO}
          </strong>
        </h2>
      </div>

      <div className="cardBox">
        <div className="card">
          <div>
            <div className="numbers">{consultasPendientes.length}</div>
            <div className="cardName">Consultas pendientes</div>
          </div>

          <div className="iconBx">
            <IonIcon icon={heartCircleOutline} />
          </div>
        </div>

        <div className="card">
          <div>
            <div className="numbers">{derivacionesPendientes.length}</div>
            <div className="cardName">Derivaciones pendientes</div>
          </div>

          <div className="iconBx">
            <IonIcon icon={radioOutline} />
          </div>
        </div>
      </div>

      <div className="detailsDeriv">
        <div className="consultasPendientes">
          <div className="cardHeader">
            <h2>Consultas pendientes</h2>
          </div>

          <table className="tablaConsulta">
            <thead>
              <tr>
                <td>Atención</td>
                <td>Inicio</td>
                <td>Fin</td>
                <td>Actualizar</td>
              </tr>
            </thead>

            <tbody>
              {consultasPendientes.length > 0 ? (
                consultasPendientes.map((consulta, index) => (
                  <tr key={index}>
                    <td>{formatearFecha(consulta.FECHA_ATENCION)}</td>
                    <td>{consulta.HORA_INICIO}</td>
                    <td>{consulta.HORA_FIN}</td>
                    <td>
                      <Link to={`/Consultasps/edit/${consulta.ID_CONSULTA_PS}`} className="btn-edit" title="Actualizar">
                        <IonIcon icon={createOutline} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay consultas pendientes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="alumnosDerivados">
          <div className="cardHeader">
            <h2>Derivaciones pendientes</h2>
          </div>

          <table>
            <tbody>
              {derivacionesPendientes.length > 0 ? (
                derivacionesPendientes.map((derivacion, index) => (
                  <tr key={index}>
                    <td>
                      <h4 style={{textTransform:'capitalize'}}>
                        {getUrgenciaEmoji(derivacion.URGENCIA)}
                        {derivacion.ALUMNO?.APELLIDOS}, {derivacion.ALUMNO?.NOMBRES?.split(' ')[0]}

                        <Link to={`/Consultasps/add/${derivacion.ID_DERIVACION}`} className="btn-details" title="Agregar consulta"
                          style={{ float: 'right' }}
                        >
                          <IonIcon icon={heartCircleOutline} />
                        </Link>
                        <br />
                        <span style={{ marginLeft: '20px' }}>
                          {derivacion.ALUMNO?.AREA_PE.NOMBRE_AREA_PE}
                        </span>
                        <br />
                      </h4>
                      <hr />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="1">No hay derivaciones pendientes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Welcome;
