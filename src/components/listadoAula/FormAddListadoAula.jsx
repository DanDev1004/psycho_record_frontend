import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Select from "react-select";
import "../../assets/styles/Form.css";

const FormAddListadoAula = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [tutores, setTutores] = useState([]);
    const [alumno, setAlumno] = useState(null);
    const [tutor, setTutor] = useState(null);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cargarAlumnos = async () => {
            try {
                const response = await axios.get("http://localhost:5000/alumno");
                const options = response.data.map(alumno => ({
                    value: alumno.ID_ALUMNO,
                    label: `${alumno.NOMBRE_ALUMNO} ${alumno.APELLIDO_ALUMNO} - ${alumno?.AULA.AREA_PE.NOMBRE_AREA_PE}`,
                    idAreaPe: alumno?.AULA.ID_AREA_PE,
                }));
                setAlumnos(options);
            } catch (error) {
                console.error("Error al cargar los alumnos", error);
            }
        };

        const cargarTutores = async () => {
            try {
                const response = await axios.get("http://localhost:5000/tutor");
                const options = response.data.map(tutor => ({
                    value: tutor.ID_TUTOR,
                    label: `${tutor.INSTRUCTOR?.NOMBRE_INSTRUCTOR} ${tutor.INSTRUCTOR?.APELLIDO_INSTRUCTOR} - ${tutor.INSTRUCTOR?.AREA_PE?.NOMBRE_AREA_PE || tutor.AULA?.AREA_PE?.NOMBRE_AREA_PE || "Área no asignada"}`,
                    idAreaPe: tutor.INSTRUCTOR?.AREA_PE?.ID_AREA_PE || tutor.AULA?.ID_AREA_PE,
                }));
                setTutores(options);
            } catch (error) {
                console.error("Error al cargar los tutores", error);
            }
        };

        cargarAlumnos();
        cargarTutores();
    }, []);

    const saveListadoAula = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/listadoaula", {
                ID_ALUMNO: alumno ? alumno.value : null,
                ID_TUTOR: tutor ? tutor.value : null,
            });
            navigate("/listadoaula");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    const tutoresDisponibles = alumno
        ? tutores.filter((tutor) => tutor.idAreaPe === alumno.idAreaPe)
        : [];

    return (
        <div>
            <NavLink to={"/listadoaula"}>
                <button className="btn-regresar">Regresar</button>
            </NavLink>

            <h1 className="title-form">Listado de Aula</h1>
            <div className="contenedor">
                <form onSubmit={saveListadoAula}>
                    <p>{msg}</p>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Alumno</label>
                        </div>
                        <div className="col-75">
                            <Select
                                value={alumno}
                                onChange={setAlumno}
                                options={alumnos}
                                placeholder="Selecciona un alumno"
                                className="input-form"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Tutor</label>
                        </div>
                        <div className="col-75">
                            <Select
                                value={tutor}
                                onChange={setTutor}
                                options={tutoresDisponibles}
                                placeholder="Selecciona un tutor"
                                className="input-form"
                            />
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

export default FormAddListadoAula;
