import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import "../../assets/styles/Form.css";

const FormEditInstructor = () => {
  const [dni, setDni] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [areaPeId, setAreaPeId] = useState(null);
  const [areaPeOptions, setAreaPeOptions] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getInstructorById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/instructor/${id}`);
        setDni(response.data.DNI_INSTRUCTOR);
        setNombres(response.data.NOMBRE_INSTRUCTOR);
        setApellidos(response.data.APELLIDO_INSTRUCTOR);
        setAreaPeId(response.data.ID_AREA_PE ? response.data.ID_AREA_PE : null);
        setFechaInicio(response.data.FECHA_INICIO.split('T')[0]);
        setFechaFin(response.data.FECHA_FIN.split('T')[0]);
        setEstado(response.data.ESTADO);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };

    const cargarOpcionesArea = async () => {
      try {
        const response = await axios.get("http://localhost:5000/areaPe");
        const opciones = response.data.map(area => ({
          value: area.ID_AREA_PE,
          label: area.NOMBRE_AREA_PE,
        }));
        setAreaPeOptions(opciones);
      } catch (error) {
        console.error("Error al cargar áreas", error);
      }
    };

    getInstructorById();
    cargarOpcionesArea();
  }, [id]);

  const handleFechaInicioChange = (e) => {
    const selectedFechaInicio = e.target.value;
    setFechaInicio(selectedFechaInicio);

    // Ajustar la fecha mínima de finalización según la fecha de inicio
    if (fechaFin && selectedFechaInicio > fechaFin) {
      setFechaFin("");
    }
  };

  const handleFechaFinChange = (e) => {
    const selectedFechaFin = e.target.value;
    setFechaFin(selectedFechaFin);
  };

  const updateInstructor = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/instructor/${id}`, {
        DNI_INSTRUCTOR: dni,
        NOMBRE_INSTRUCTOR: nombres,
        APELLIDO_INSTRUCTOR: apellidos,
        ID_AREA_PE: areaPeId ? Number(areaPeId.value) : null,
        FECHA_INICIO: fechaInicio,
        FECHA_FIN: fechaFin,
        ESTADO: estado,
      });
      navigate("/instructores");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <NavLink to={"/instructores"}>
        <button className="btn-regresar">Regresar</button>
      </NavLink>

      <h1 className="title-form">Actualizar Instructor</h1>

      <div className="contenedor">
        <form onSubmit={updateInstructor}>
          <p>{msg}</p>

          <div className="row">
            <div className="col-25">
              <label className="label-form">DNI</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="DNI"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Nombres</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="text"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                placeholder="Nombres"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Apellidos</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                placeholder="Apellidos"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Área</label>
            </div>
            <div className="col-75">
              <Select
                className="input-form"
                value={areaPeOptions.find(option => option.value === areaPeId)}
                onChange={setAreaPeId}
                options={areaPeOptions}
                placeholder="Seleccione un área"
                isClearable
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Fecha Inicio</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="date"
                value={fechaInicio}
                onChange={handleFechaInicioChange}
                min="1970-01-01"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Fecha Fin</label>
            </div>
            <div className="col-75">
              <input
                className="input-form"
                type="date"
                value={fechaFin}
                onChange={handleFechaFinChange}
                min={fechaInicio} 
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label className="label-form">Estado</label>
            </div>
            <div className="col-75">
              <select
                className="input-form"
                value={estado}
                onChange={(e) => setEstado(e.target.value === "true")}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="row">
            <button className="button-form" type="submit">Actualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditInstructor;
