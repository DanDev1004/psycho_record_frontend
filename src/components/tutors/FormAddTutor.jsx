import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Select from "react-select";
import "../../assets/styles/Form.css";  

const FormAddTutor = () => {
    const [instructores, setInstructores] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [aulasFiltradas, setAulasFiltradas] = useState([]);
    const [instructor, setInstructor] = useState(null);
    const [aula, setAula] = useState(null);
    const [estado, setEstado] = useState(true);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cargarInstructores = async () => {
            try {
                const response = await axios.get("http://localhost:5000/instructor");
                const options = response.data.map(inst => ({
                    value: inst.ID_INSTRUCTOR,
                    label: `${inst.NOMBRE_INSTRUCTOR} ${inst.APELLIDO_INSTRUCTOR}`,
                    areaPe: inst.ID_AREA_PE, 
                }));
                setInstructores(options);
            } catch (error) {
                console.error("Error al cargar los instructores", error);
            }
        };

        const cargarAulas = async () => {
            try {
                const response = await axios.get("http://localhost:5000/aula");
                const options = response.data.map(aula => ({
                    value: aula.ID_AULA,
                    label: `${aula.ANIO} - ${aula.PERIODO} ( ${convertirRomanos(aula.CICLO)} ) - ${aula.AREA_PE?.NOMBRE_AREA_PE || "Sin área"}`,
                    areaPe: aula.ID_AREA_PE, 
                }));
                setAulas(options);
                setAulasFiltradas(options); 
            } catch (error) {
                console.error("Error al cargar las aulas", error);
            }
        };

        cargarInstructores();
        cargarAulas();
    }, []);

    useEffect(() => {
        if (instructor && instructor.areaPe) {
            const aulasFiltradas = aulas.filter(aula => aula.areaPe === instructor.areaPe);
            setAulasFiltradas(aulasFiltradas);
        } else {
            setAulasFiltradas(aulas);
        }
    }, [instructor, aulas]);

    const guardarTutor = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/tutor", {
                ID_INSTRUCTOR: instructor ? instructor.value : null,
                ID_AULA: aula ? aula.value : null,
                ESTADO: estado,
            });
            navigate("/tutores");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    const convertirRomanos = (num) => {
        const numerosRomanos = ['I', 'II', 'III', 'IV', 'V', 'VI'];
        return numerosRomanos[num - 1] || num;
    };

    return (
        <div>
            <NavLink to={"/tutores"}>
                <button className="btn-regresar">Regresar</button>
            </NavLink>

            <h1 className="title-form">Asignar aula</h1>

            <div className="contenedor">
                <form onSubmit={guardarTutor}>
                    <p className="msg">{msg}</p>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Instructor</label>
                        </div>
                        <div className="col-75">
                            <Select
                                value={instructor}
                                onChange={setInstructor}
                                options={instructores}
                                className="input-form"
                                placeholder="Selecciona un instructor"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Aula</label>
                        </div>
                        <div className="col-75">
                            <Select
                                value={aula}
                                onChange={setAula}
                                options={aulasFiltradas}
                                className="input-form"
                                placeholder="Selecciona un aula"
                                isClearable
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
                                <option value={true}>Activo</option>
                                <option value={false}>Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <button className="button-form" type="submit">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormAddTutor;
