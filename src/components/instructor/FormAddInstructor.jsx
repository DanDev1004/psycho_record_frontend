import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Select from "react-select";
import "../../assets/styles/Form.css";

const FormAddInstructor = () => {
  const [dni, setDni] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [areaPe, setAreaPe] = useState(null); 
  const [areas, setAreas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    obtenerAreas();
  }, []);

  const obtenerAreas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/areape");
      const options = response.data.map(area => ({
        value: area.ID_AREA_PE,
        label: area.NOMBRE_AREA_PE
      }));
      setAreas(options);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFechaInicioChange = (e) => {
    const selectedFechaInicio = e.target.value;
    setFechaInicio(selectedFechaInicio);

    if (fechaFin && selectedFechaInicio > fechaFin) {
      setFechaFin("");
    }
  };

  const handleFechaFinChange = (e) => {
    const selectedFechaFin = e.target.value;
    setFechaFin(selectedFechaFin);
  };

  const saveInstructor = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/instructor", {
        DNI_INSTRUCTOR: dni,
        NOMBRE_INSTRUCTOR: nombres,
        APELLIDO_INSTRUCTOR: apellidos,
        ID_AREA_PE: areaPe ? areaPe.value : null, 
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

      <h1 className="title-form">Agregar instructor</h1>

      <div className="contenedor">
        <form onSubmit={saveInstructor}>
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
                value={areaPe}
                onChange={setAreaPe}
                options={areas}
                placeholder="Seleccionar área"
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
            <button className="button-form" type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAddInstructor;
