import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Select from "react-select";
import "../../assets/styles/Form.css";

const FormAddAlumno = () => {
    const [dni, setDni] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [areaPe, setAreaPe] = useState(null); 
    const [sexo, setSexo] = useState("M");
    const [telefono, setTelefono] = useState("");
    const [religion, setReligion] = useState(null);
    const [estadoCivil, setEstadoCivil] = useState(null);
    const [direccionNacimiento, setDireccionNacimiento] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [domicilio, setDomicilio] = useState("");
    const [ciclo, setCiclo] = useState(null); 
    const [turno, setTurno] = useState("M");

    const [religionOptions, setReligionOptions] = useState([]);
    const [estadoCivilOptions, setEstadoCivilOptions] = useState([]);
    const [areaPeOptions, setAreaPeOptions] = useState([]); 
    const [cicloOptions, setCicloOptions] = useState([]);

    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cargarReligiones = async () => {
            try {
                const response = await axios.get("http://localhost:5000/religion");
                const ListaOpciones = response.data.map(religion => ({
                    value: religion.ID_RELIGION,
                    label: religion.NOMBRE_RELIGION,
                }));
                setReligionOptions(ListaOpciones);
            } catch (error) {
                console.error("Error al cargar las religiones", error);
            }
        };

        const cargarEstadosCiviles = async () => {
            try {
                const response = await axios.get("http://localhost:5000/estadoCivil");
                const ListaOpciones = response.data.map(estadoCivil => ({
                    value: estadoCivil.ID_EC,
                    label: estadoCivil.NOMBRE_EC,
                }));
                setEstadoCivilOptions(ListaOpciones);
            } catch (error) {
                console.error("Error al cargar los estados civiles", error);
            }
        };

        const cargarAreasPe = async () => {
            try {
                const response = await axios.get("http://localhost:5000/areaPe");
                const ListaOpciones = response.data.map(areaPe => ({
                    value: areaPe.ID_AREA_PE,
                    label: areaPe.NOMBRE_AREA_PE,
                }));
                setAreaPeOptions(ListaOpciones);
            } catch (error) {
                console.error("Error al cargar las áreas PE", error);
            }
        };

        const cargarCiclos = () => {
            const ciclos = [1, 2, 3, 4, 5, 6].map((ciclo) => ({
                value: ciclo,
                label: convertirRomanos(ciclo),
            }));
            setCicloOptions(ciclos);
        };

        cargarReligiones();
        cargarEstadosCiviles();
        cargarAreasPe();
        cargarCiclos();
    }, []);

    const saveAlumno = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/alumno", {
                DNI: dni,
                NOMBRES: nombres,
                APELLIDOS: apellidos,
                SEXO: sexo,
                TELEFONO: telefono,
                ID_RELIGION: religion ? religion.value : null,
                ID_EC: estadoCivil ? estadoCivil.value : null,
                ID_AREA_PE: areaPe ? areaPe.value : null, 
                DIR_NAC: direccionNacimiento,
                FECH_NAC: fechaNacimiento,
                DOMICILIO: domicilio,
                CICLO: ciclo ? ciclo.value : null, 
                TURNO: turno,
            });
            navigate("/alumnos");
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
            <NavLink to={"/alumnos"}>
                <button className="btn-regresar">Regresar</button>
            </NavLink>

            <h1 className="title-form">Agregar Alumno</h1>

            <div className="contenedor">
                <form onSubmit={saveAlumno}>
                <p style={{color:'red'}}> {msg}</p>

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
                            <label className="label-form">Prog. Estudio</label>
                        </div>
                        <div className="col-75">
                            <Select
                                options={areaPeOptions}
                                value={areaPe}
                                onChange={setAreaPe}
                                className="input-form"
                                placeholder="Selecciona un programa de estudio"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Ciclo</label>
                        </div>
                        <div className="col-75">
                            <Select
                                options={cicloOptions}
                                value={ciclo}
                                onChange={setCiclo}
                                className="input-form"
                                placeholder="Selecciona un ciclo"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Turno</label>
                        </div>
                        <div className="col-75">
                            <select
                                className="input-form"
                                value={turno}
                                onChange={(e) => setTurno(e.target.value)}
                            >
                                <option value="M">Mañana</option>
                                <option value="T">Tarde</option>
                            </select>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Sexo</label>
                        </div>
                        <div className="col-75">
                            <select
                                className="input-form"
                                value={sexo}
                                onChange={(e) => setSexo(e.target.value)}
                            >
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Teléfono</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="text"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="Teléfono"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Religión</label>
                        </div>
                        <div className="col-75">
                            <Select
                                options={religionOptions}
                                value={religion}
                                onChange={setReligion}
                                className="input-form"
                                placeholder="Selecciona una religión"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Estado Civil</label>
                        </div>
                        <div className="col-75">
                            <Select
                                options={estadoCivilOptions}
                                value={estadoCivil}
                                onChange={setEstadoCivil}
                                className="input-form"
                                placeholder="Selecciona un estado civil"
                            />
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Dirección Nac.</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="text"
                                value={direccionNacimiento}
                                onChange={(e) => setDireccionNacimiento(e.target.value)}
                                placeholder="Dirección de nacimiento"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Fecha Nac.</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="date"
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                                placeholder="Fecha de nacimiento"
                                min="1970-01-01"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-25">
                            <label className="label-form">Domicilio</label>
                        </div>
                        <div className="col-75">
                            <input
                                className="input-form"
                                type="text"
                                value={domicilio}
                                onChange={(e) => setDomicilio(e.target.value)}
                                placeholder="Domicilio"
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

export default FormAddAlumno;
