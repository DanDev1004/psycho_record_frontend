import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import "../../assets/styles/Form.css";  

const FormEditTutor = () => {
    const [instructor, setInstructor] = useState({}); 
    const [aula, setAula] = useState(null);
    const [estado, setEstado] = useState(true);
    const [aulaOptions, setAulaOptions] = useState([]);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getTutorById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/tutor/${id}`);
                const tutorData = response.data;

                setInstructor(tutorData.INSTRUCTOR);  
                setAula(tutorData.ID_AULA ? { value: tutorData.ID_AULA, label: `${tutorData.AULA.ANIO} - ${tutorData.AULA.PERIODO} (${convertirRomanos(tutorData.AULA.CICLO)}) - ${tutorData.AULA?.AREA_PE?.NOMBRE_AREA_PE || "Sin área"}` } : null);
                setEstado(tutorData.ESTADO);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };

        const cargarAulas = async () => {
            try {
                const response = await axios.get("http://localhost:5000/aula");
                const options = response.data.map(aula => ({
                    value: aula.ID_AULA,
                    label: `${aula.ANIO} - ${aula.PERIODO} (${convertirRomanos(aula.CICLO)}) - ${aula.AREA_PE?.NOMBRE_AREA_PE || "Sin área"}`,
                    areaPe: aula.ID_AREA_PE, 
                }));
                setAulaOptions(options);
            } catch (error) {
                console.error("Error al cargar las aulas", error);
            }
        };

        getTutorById();
        cargarAulas();
    }, [id]);

    useEffect(() => {
        if (instructor && instructor.ID_AREA_PE) {
            const aulasFiltradas = aulaOptions.filter(aula => aula.areaPe === instructor.ID_AREA_PE);
            setAulaOptions(aulasFiltradas);
        }
    }, [instructor, aulaOptions]);

    const updateTutor = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/tutor/${id}`, {
                ID_INSTRUCTOR: instructor.ID_INSTRUCTOR,  
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
            <h1 className="title-form">Actualizar aula</h1>
            <div className="contenedor">
                <form onSubmit={updateTutor}>
                    <p className="msg">{msg}</p>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Instructor: </label>
                        </div>
                        <div className="col-75">
                            <input
                                type="text"
                                className="input-form"
                                style={{ border: "none", backgroundColor: "#f9f9f9", pointerEvents: "none"}}
                                value={`${instructor.NOMBRE_INSTRUCTOR} ${instructor.APELLIDO_INSTRUCTOR}`}
                                readOnly
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
                                options={aulaOptions}
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
                            Actualizar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormEditTutor;
